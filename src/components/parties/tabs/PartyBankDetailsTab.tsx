import { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { CURRENCIES } from '../../../utils/constants';

interface BankDetail {
  id: string;
  bankName: string;
  branchName?: string;
  accountNumber: string;
  accountName: string;
  swiftCode?: string;
  iban?: string;
  currency: string;
  isPrimary: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

interface PartyBankDetailsTabProps {
  bankDetails: BankDetail[];
  partyId?: string;
  onBankDetailAdded?: () => void;
}

export function PartyBankDetailsTab({ bankDetails: initialBankDetails, partyId }: PartyBankDetailsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedBankDetail, setSelectedBankDetail] = useState<BankDetail | undefined>();

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedBankDetail(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Bank Details</h3>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Details
        </Button>
      </div>

      {initialBankDetails.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {initialBankDetails.map((bankDetail) => (
            <div
              key={bankDetail.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">{bankDetail.bankName}</h4>
                    {bankDetail.branchName && (
                      <p className="text-sm text-gray-500">{bankDetail.branchName}</p>
                    )}
                  </div>
                </div>
                {bankDetail.isPrimary && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Primary
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-2">
                <div className="text-sm">
                  <span className="text-gray-500">Account:</span>{' '}
                  <span className="font-medium">{bankDetail.accountNumber}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Name:</span>{' '}
                  <span className="font-medium">{bankDetail.accountName}</span>
                </div>
                {bankDetail.swiftCode && (
                  <div className="text-sm">
                    <span className="text-gray-500">SWIFT:</span>{' '}
                    <span className="font-medium">{bankDetail.swiftCode}</span>
                  </div>
                )}
                {bankDetail.iban && (
                  <div className="text-sm">
                    <span className="text-gray-500">IBAN:</span>{' '}
                    <span className="font-medium">{bankDetail.iban}</span>
                  </div>
                )}
                <div className="text-sm">
                  <span className="text-gray-500">Currency:</span>{' '}
                  <span className="font-medium">{bankDetail.currency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          No bank details added yet. Click the button above to add bank details.
        </p>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {selectedBankDetail ? 'Edit Bank Details' : 'Add Bank Details'}
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Bank Name" required />
              <Input label="Branch Name" />
              <Input label="Account Number" required />
              <Input label="Account Name" required />
              <Input label="SWIFT Code" />
              <Input label="IBAN" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option value="">Select Currency</option>
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Set as primary bank account
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Bank Details</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}