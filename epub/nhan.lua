-- Nhãn đậm đầu dòng ("Chi phí:", "Nguồn:"...) của các danh sách ngay dưới tiêu đề mục (###):
-- bọc vào span.nhan để CSS tách thành dòng riêng, và bỏ khoảng trắng ngay sau nhãn
-- để nội dung nằm sát dưới nhãn. Khung "Ở Việt Nam" (blockquote) không bị đụng tới.
local function la_nhan(inlines)
  local dau = inlines[1]
  if not dau or dau.t ~= 'Strong' then return false end
  return pandoc.utils.stringify(dau):sub(-1) == ':'
end

function Pandoc(doc)
  local cap = 0
  for _, block in ipairs(doc.blocks) do
    if block.t == 'Header' then
      cap = block.level
    elseif block.t == 'BulletList' and cap == 3 then
      for _, item in ipairs(block.content) do
        local dau = item[1]
        if dau and (dau.t == 'Plain' or dau.t == 'Para') and la_nhan(dau.content) then
          local nhan = pandoc.Span({dau.content[1]}, pandoc.Attr('', {'nhan'}))
          local conlai = pandoc.List({nhan})
          for i = 2, #dau.content do
            if not (i == 2 and dau.content[i].t == 'Space') then conlai:insert(dau.content[i]) end
          end
          dau.content = conlai
        end
      end
    end
  end
  return doc
end
