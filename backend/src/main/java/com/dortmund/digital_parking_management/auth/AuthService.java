package com.dortmund.digital_parking_management.auth;

import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dortmund.digital_parking_management.auth.dto.AuthResponse;
import com.dortmund.digital_parking_management.auth.dto.LoginRequest;
import com.dortmund.digital_parking_management.auth.dto.RegisterRequest;
import com.dortmund.digital_parking_management.auth.model.UserRole;
import com.dortmund.digital_parking_management.user.AppUser;
import com.dortmund.digital_parking_management.user.UserService;

@Service
class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    AuthService(UserService userService, JwtService jwtService, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        var user = userService.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return toAuthResponse(user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userService.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + request.email());
        }

        var hashedPassword = passwordEncoder.encode(request.password());
        var user = new AppUser(request.email(), hashedPassword, request.firstName(),
                request.lastName(), request.phoneNumber(), UserRole.CITIZEN);
        user = userService.saveUser(user);

        return toAuthResponse(user);
    }

    public AuthResponse getCurrentUser(UUID userId) {
        var user = userService.findUserById(userId);
        return new AuthResponse(null, user.getId(), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name());
    }

    private AuthResponse toAuthResponse(AppUser user) {
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name());
    }
}
