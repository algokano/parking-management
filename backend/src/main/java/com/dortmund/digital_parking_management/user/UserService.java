package com.dortmund.digital_parking_management.user;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dortmund.digital_parking_management.user.dto.*;
import com.dortmund.digital_parking_management.user.repository.AppUserRepository;
import com.dortmund.digital_parking_management.user.repository.VehicleRepository;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final AppUserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    UserService(AppUserRepository userRepository, VehicleRepository vehicleRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    // ---- User CRUD ----

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered: " + request.email());
        }
        var user = new AppUser(request.email(), request.firstName(), request.lastName(), request.phoneNumber());
        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse getUser(UUID userId) {
        return UserResponse.from(findUser(userId));
    }

    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        var user = findUser(userId);
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhoneNumber(request.phoneNumber());
        return UserResponse.from(userRepository.save(user));
    }

    // ---- Vehicle management ----

    @Transactional
    public VehicleResponse addVehicle(UUID userId, CreateVehicleRequest request) {
        var user = findUser(userId);
        if (vehicleRepository.existsByLicensePlate(request.licensePlate())) {
            throw new IllegalArgumentException("License plate already registered: " + request.licensePlate());
        }
        var vehicle = new Vehicle(user, request.licensePlate(), request.make(), request.model(), request.color());
        return VehicleResponse.from(vehicleRepository.save(vehicle));
    }

    public List<VehicleResponse> listVehicles(UUID userId) {
        findUser(userId); // ensure user exists
        return vehicleRepository.findByUserId(userId).stream().map(VehicleResponse::from).toList();
    }

    @Transactional
    public void removeVehicle(UUID userId, UUID vehicleId) {
        var vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new NoSuchElementException("Vehicle not found: " + vehicleId));
        if (!vehicle.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Vehicle does not belong to user");
        }
        vehicleRepository.delete(vehicle);
    }

    // ---- Public methods for other modules ----

    public Optional<AppUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public AppUser saveUser(AppUser user) {
        return userRepository.save(user);
    }

    public AppUser findUserById(UUID userId) {
        return findUser(userId);
    }

    public void validateUserExists(UUID userId) {
        findUser(userId);
    }

    public void validateVehicleBelongsToUser(UUID vehicleId, UUID userId) {
        var vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new NoSuchElementException("Vehicle not found: " + vehicleId));
        if (!vehicle.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Vehicle does not belong to user");
        }
    }

    // ---- Internal helpers ----

    private AppUser findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + userId));
    }
}
