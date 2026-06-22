package com.banking.bms.service;

import com.banking.bms.entity.Transaction;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionService {
    Transaction deposit(String accountNumber, BigDecimal amount, String remarks);
    Transaction withdraw(String accountNumber, BigDecimal amount, String remarks);
    Transaction transfer(String sourceAccountNumber, String destinationAccountNumber, BigDecimal amount, String remarks);
    List<Transaction> getAccountHistory(String accountNumber);
    List<Transaction> getAllTransactions();
}
