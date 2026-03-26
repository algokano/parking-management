package com.dortmund.digital_parking_management.auth;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.dortmund.digital_parking_management.auth.dto.AuthResponse;
import com.dortmund.digital_parking_management.auth.dto.LoginRequest;
import com.dortmund.digital_parking_management.auth.dto.RegisterRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthApi {

    private final AuthService authService;

    AuthApi(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @GetMapping("/me")
    ResponseEntity<AuthResponse> me(@AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(authService.getCurrentUser(userId));
    }
}
