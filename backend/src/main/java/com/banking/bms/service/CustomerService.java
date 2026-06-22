package com.banking.bms.service;

import com.banking.bms.entity.Customer;
import java.util.List;

public interface CustomerService {
    Customer getCustomerByUserId(Long userId);
    Customer getCustomerById(Long customerId);
    Customer updateCustomer(Long customerId, Customer customerDetails);
    List<Customer> getAllCustomers();
}
