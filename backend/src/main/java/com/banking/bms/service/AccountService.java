package com.banking.bms.service;

import com.banking.bms.entity.Account;
import com.banking.bms.entity.AccountStatus;
import com.banking.bms.entity.AccountType;

import java.util.List;

public interface AccountService {
    Account createAccount(Long customerId, AccountType accountType);
    List<Account> getCustomerAccounts(Long customerId);
    Account getAccountByNumber(String accountNumber);
    Account updateAccountStatus(Long accountId, AccountStatus status);
    List<Account> getAllAccounts();
}
