import { useState, useEffect } from 'react';
import { PartyContact } from '../../../types/party';
import { Button } from '../../ui/Button';
import { PartyContactForm } from '../PartyContactForm';
import { Plus, Mail, Phone } from 'lucide-react';
import { partiesApi } from '../../../services/api/parties';
import { toast } from 'react-hot-toast';

interface PartyContactsTabProps {
  contacts: PartyContact[];
  partyId?: string;
  onContactAdded?: () => void;
}

export function PartyContactsTab({ contacts: initialContacts, partyId, onContactAdded }: PartyContactsTabProps) {
  const [contacts, setContacts] = useState<PartyContact[]>(initialContacts);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<PartyContact | undefined>();

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  const handleAddContact = async (contactData: Partial<PartyContact>) => {
    if (!partyId) {
      toast.error('Please save the party first before adding contacts');
      return;
    }

    try {
      const newContact = await partiesApi.addContact(partyId, contactData);
      setContacts(prev => [...prev, newContact]);
      toast.success('Contact added successfully');
      onContactAdded?.();
      setShowContactForm(false);
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast.error(error.message || 'Failed to add contact');
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setSelectedContact(undefined);
    setShowContactForm(true);
  };

  const handleContactClick = (e: React.MouseEvent, contact: PartyContact) => {
    e.preventDefault(); // Prevent form submission
    setSelectedContact(contact);
    setShowContactForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-500 transition-colors cursor-pointer"
              onClick={(e) => handleContactClick(e, contact)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{contact.name}</h4>
                  {contact.designation && (
                    <p className="text-sm text-gray-500">{contact.designation}</p>
                  )}
                </div>
                {contact.isPrimary && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Primary
                  </span>
                )}
              </div>

              {contact.email && (
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="hover:text-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {contact.email}
                  </a>
                </div>
              )}

              {(contact.phone || contact.mobile) && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{contact.phone || contact.mobile}</span>
                </div>
              )}

              {contact.address && (
                <p className="mt-2 text-sm text-gray-500">{contact.address}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          No contacts added yet. Click the button above to add a contact.
        </p>
      )}

      {showContactForm && (
        <PartyContactForm
          contact={selectedContact}
          onSubmit={handleAddContact}
          onClose={() => {
            setShowContactForm(false);
            setSelectedContact(undefined);
          }}
        />
      )}
    </div>
  );
}