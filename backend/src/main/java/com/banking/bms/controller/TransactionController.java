package com.banking.bms.controller;

import com.banking.bms.dto.TransactionRequest;
import com.banking.bms.entity.Transaction;
import com.banking.bms.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/deposit")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<Transaction> deposit(@Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.deposit(
                request.getDestinationAccountNumber(), 
                request.getAmount(), 
                request.getRemarks());
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Transaction> withdraw(@Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.withdraw(
                request.getSourceAccountNumber(), 
                request.getAmount(), 
                request.getRemarks());
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Transaction> transfer(@Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.transfer(
                request.getSourceAccountNumber(), 
                request.getDestinationAccountNumber(), 
                request.getAmount(), 
                request.getRemarks());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/history/{accountNumber}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getAccountHistory(@PathVariable String accountNumber) {
        return ResponseEntity.ok(transactionService.getAccountHistory(accountNumber));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
}
