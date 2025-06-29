package com.pawpal.controller;

import com.pawpal.dto.ContactDto;
import com.pawpal.entity.Contact;
import com.pawpal.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody ContactDto contactDto) {
        Contact createdContact = contactService.createContact(contactDto);
        return ResponseEntity.ok(createdContact);
    }

    @GetMapping
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<List<Contact>> getAllContacts() {
        List<Contact> contacts = contactService.findAllContacts();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
        Contact contact = contactService.findById(id);
        return ResponseEntity.ok(contact);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<List<Contact>> getContactsByStatus(@PathVariable Contact.Status status) {
        List<Contact> contacts = contactService.findContactsByStatus(status);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<List<Contact>> getContactsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Contact> contacts = contactService.findContactsByDateRange(startDate, endDate);
        return ResponseEntity.ok(contacts);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<Contact> updateContactStatus(@PathVariable Long id, @RequestParam Contact.Status status) {
        Contact updatedContact = contactService.updateContactStatus(id, status);
        return ResponseEntity.ok(updatedContact);
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
