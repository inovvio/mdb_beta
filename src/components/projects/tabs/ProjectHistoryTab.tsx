```tsx
import { ProjectHistory } from '../../../types/project';
import { formatDistanceToNow } from 'date-fns';

interface ProjectHistoryTabProps {
  history: ProjectHistory[];
}

export function ProjectHistoryTab({ history }: ProjectHistoryTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project History</h3>

      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {history.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== history.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                      <span className="text-primary-600 text-sm font-medium">
                        {event.action.charAt(0)}
                      </span>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {event.description}{' '}
                        <span className="font-medium text-gray-900">
                          by {event.userName}
                        </span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {history.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No history available for this project yet.
        </p>
      )}
    </div>
  );
}
```