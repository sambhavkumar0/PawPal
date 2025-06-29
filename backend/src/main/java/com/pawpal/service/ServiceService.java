package com.pawpal.service;

import com.pawpal.entity.Service;
import com.pawpal.exception.ResourceNotFoundException;
import com.pawpal.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@org.springframework.stereotype.Service
@Transactional
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    public Service findById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
    }

    public List<Service> findAllServices() {
        return serviceRepository.findAll();
    }

    public List<Service> findActiveServices() {
        return serviceRepository.findByIsActiveTrue();
    }

    public List<Service> findServicesByCategory(Service.Category category) {
        return serviceRepository.findByCategory(category);
    }

    public List<Service> findActiveServicesByCategory(Service.Category category) {
        return serviceRepository.findByCategoryAndIsActiveTrue(category);
    }

    public List<Service> findServicesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return serviceRepository.findByPriceRangeAndIsActiveTrue(minPrice, maxPrice);
    }

    public List<Service> searchServicesByName(String name) {
        return serviceRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name);
    }

    public List<Service> findServicesByMaxDuration(Integer maxDuration) {
        return serviceRepository.findByMaxDurationAndIsActiveTrue(maxDuration);
    }

    public Service updateService(Long id, Service serviceDetails) {
        Service service = findById(id);
        
        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
        service.setPrice(serviceDetails.getPrice());
        service.setDurationMinutes(serviceDetails.getDurationMinutes());
        service.setCategory(serviceDetails.getCategory());
        
        return serviceRepository.save(service);
    }

    public void deactivateService(Long id) {
        Service service = findById(id);
        service.setIsActive(false);
        serviceRepository.save(service);
    }

    public void activateService(Long id) {
        Service service = findById(id);
        service.setIsActive(true);
        serviceRepository.save(service);
    }
}
