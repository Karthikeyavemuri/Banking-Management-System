package com.banking.bms.dto;

import com.banking.bms.entity.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountRequest {
    
    @NotNull
    private Long customerId;
    
    @NotNull
    private AccountType accountType;
}
