import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type React from 'react'
import { Fragment } from 'react'

type TablePanelProps = {
  openState: boolean
  onClose: () => void
  title: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  iconClassName?: string
  children: React.ReactNode
}

const TablePanel: React.FC<TablePanelProps> = ({ openState, title, onClose, icon: Icon, iconClassName, children }) => {
  return (
    <Transition.Root show={openState} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ... existing Transition.Child for background ... */}

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden overflow-y-auto rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-h-[80vh] sm:w-full sm:max-w-4xl">
                <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">关闭</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    {Icon && (
                      <div
                        className={classNames(
                          'mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
                          iconClassName,
                        )}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                    )}
                    <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="mb-4 text-lg font-medium leading-6 text-gray-900">
                        {title}
                      </Dialog.Title>
                      <div className="overflow-x-auto">{children}</div>
                    </div>
                  </div>
                </div>
                {/* 移除了原来的底部关闭按钮 */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default TablePanel
