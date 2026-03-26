package com.dortmund.digital_parking_management.user;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dortmund.digital_parking_management.user.dto.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
class UserApi {

    private final UserService userService;

    UserApi(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @GetMapping("/{userId}")
    UserResponse getUser(@PathVariable UUID userId) {
        return userService.getUser(userId);
    }

    @PutMapping("/{userId}")
    UserResponse updateUser(@PathVariable UUID userId, @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateUser(userId, request);
    }

    @PostMapping("/{userId}/vehicles")
    ResponseEntity<VehicleResponse> addVehicle(@PathVariable UUID userId,
                                               @Valid @RequestBody CreateVehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.addVehicle(userId, request));
    }

    @GetMapping("/{userId}/vehicles")
    List<VehicleResponse> listVehicles(@PathVariable UUID userId) {
        return userService.listVehicles(userId);
    }

    @DeleteMapping("/{userId}/vehicles/{vehicleId}")
    ResponseEntity<Void> removeVehicle(@PathVariable UUID userId, @PathVariable UUID vehicleId) {
        userService.removeVehicle(userId, vehicleId);
        return ResponseEntity.noContent().build();
    }
}
