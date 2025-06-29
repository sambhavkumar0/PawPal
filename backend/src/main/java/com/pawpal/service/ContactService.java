package com.pawpal.service;

import com.pawpal.dto.ContactDto;
import com.pawpal.entity.Contact;
import com.pawpal.exception.ResourceNotFoundException;
import com.pawpal.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    public Contact createContact(ContactDto contactDto) {
        Contact contact = new Contact();
        contact.setName(contactDto.getName());
        contact.setEmail(contactDto.getEmail());
        contact.setPhoneNumber(contactDto.getPhoneNumber());
        contact.setSubject(contactDto.getSubject());
        contact.setMessage(contactDto.getMessage());
        contact.setStatus(Contact.Status.NEW);

        return contactRepository.save(contact);
    }

    public Contact findById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }

    public List<Contact> findAllContacts() {
        return contactRepository.findAllOrderByCreatedAtDesc();
    }

    public List<Contact> findContactsByStatus(Contact.Status status) {
        return contactRepository.findByStatus(status);
    }

    public List<Contact> findContactsByEmail(String email) {
        return contactRepository.findByEmail(email);
    }

    public List<Contact> findContactsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return contactRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public Contact updateContactStatus(Long id, Contact.Status status) {
        Contact contact = findById(id);
        contact.setStatus(status);
        return contactRepository.save(contact);
    }

    public Long countContactsByStatus(Contact.Status status) {
        return contactRepository.countByStatus(status);
    }
}
