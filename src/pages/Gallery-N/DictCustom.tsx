import TablePanel from '@/components/TablePanel'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Word } from '@/typings'
import { fetchWords } from '@/utils/wordListFetcher'
import { useCallback, useEffect, useState } from 'react'
import IconFilter from '~icons/tabler/filter'

interface FilterItem {
  id: number
  word: string
}

const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1heWJlX3h1ZSIsImV4cCI6MTcyODU2MDE0OSwidG9rZW5fbGltaXQiOjEwMDB9.iGdcpQvXS9RPh0wXKvMG5TWpR5QwZbFrL7fEGwDVX8o'
const API_BASE_URL = 'https://listenhappy.xyz'

export async function updateListeningPractice(word: string, isListeningPractice: boolean): Promise<any> {
  const url = new URL(`${API_BASE_URL}/update_listening_practice`)
  url.searchParams.append('word', word)
  url.searchParams.append('is_listening_practice', isListeningPractice.toString())

  try {
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'X-API-Key': API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating listening practice status:', error)
    throw error
  }
}

function FilterDict({ onClose, onSubmit }: { onClose: () => void; onSubmit: (selectedItems: FilterItem[]) => void }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [displayedItems, setDisplayedItems] = useState<FilterItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(10)
  const [filterData, setFilterData] = useState<FilterItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        const data = await fetchWords('https://listenhappy.xyz/user/words', false)
        const formattedData: FilterItem[] = data.map((word: Word) => ({
          id: word.name,
          word: word.name,
        }))
        setFilterData(formattedData)
        setDisplayedItems(formattedData.slice(0, 10))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSubmit = async () => {
    const selectedData = filterData.filter((item) => selectedItems.includes(item.id))

    // 更新所选单词的听力练习状态
    for (const item of selectedData) {
      try {
        await updateListeningPractice(item.word, true)
        console.log(`Successfully updated listening practice status for: ${item.word}`)
      } catch (error) {
        console.error(`Failed to update listening practice status for: ${item.word}`, error)
      }
    }

    onSubmit(selectedData)
  }

  const loadMore = async () => {
    setIsLoadingMore(true)
    // Simulate a delay to show loading effect (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newItems = filterData.slice(currentIndex, currentIndex + 10)
    setDisplayedItems((prev) => [...prev, ...newItems])
    setCurrentIndex((prev) => prev + 10)
    setIsLoadingMore(false)
  }

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">加载中...</div>
  }
  return (
    <div className="space-y-4">
      <div className="max-h-[400px] overflow-x-auto overflow-y-auto">
        <Table className="w-full min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">选择</TableHead>
              <TableHead>英文</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center font-serif text-base leading-tight tracking-normal text-gray-800 dark:text-gray-200">
                    {item.word}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {currentIndex < filterData.length && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? '加载中...' : '加载更多'}
          </Button>
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button onClick={handleSubmit}>生成词典</Button>
      </div>
    </div>
  )
}

export default function DictCustom() {
  const [showPanel, setShowPanel] = useState(false)

  const onSubmit = useCallback(() => {
    setShowPanel(false)
  }, [])

  const onOpenPanel = useCallback(() => {
    setShowPanel(true)
  }, [])

  const onClosePanel = useCallback(() => {
    setShowPanel(false)
  }, [])

  return (
    <>
      {showPanel && (
        <TablePanel
          openState={showPanel}
          title="筛选表格"
          icon={IconFilter}
          buttonClassName="bg-indigo-500 hover:bg-indigo-400"
          iconClassName="text-indigo-500 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-500"
          onClose={onClosePanel}
        >
          <FilterDict onClose={onClosePanel} onSubmit={onSubmit} />
        </TablePanel>
      )}
      <button className="cursor-pointer pr-6 text-sm text-indigo-500" onClick={onOpenPanel}>
        筛选表格
      </button>
    </>
  )
}
