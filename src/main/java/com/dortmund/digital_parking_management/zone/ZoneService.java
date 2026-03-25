package com.dortmund.digital_parking_management.zone;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dortmund.digital_parking_management.zone.dto.*;
import com.dortmund.digital_parking_management.zone.model.SpaceStatus;
import com.dortmund.digital_parking_management.zone.repository.ParkingSpaceRepository;
import com.dortmund.digital_parking_management.zone.repository.ParkingZoneRepository;

@Service
@Transactional(readOnly = true)
public class ZoneService {

    private final ParkingZoneRepository zoneRepository;
    private final ParkingSpaceRepository spaceRepository;

    ZoneService(ParkingZoneRepository zoneRepository, ParkingSpaceRepository spaceRepository) {
        this.zoneRepository = zoneRepository;
        this.spaceRepository = spaceRepository;
    }

    // ---- Zone CRUD ----

    @Transactional
    public ZoneResponse createZone(CreateZoneRequest request) {
        var zone = new ParkingZone(
                request.name(), request.address(), request.zoneType(),
                request.hourlyRate(), request.latitude(), request.longitude());
        return ZoneResponse.from(zoneRepository.save(zone));
    }

    public List<ZoneResponse> listZones() {
        return zoneRepository.findAll().stream().map(ZoneResponse::from).toList();
    }

    public ZoneResponse getZone(UUID zoneId) {
        return ZoneResponse.from(findZone(zoneId));
    }

    @Transactional
    public ZoneResponse updateZone(UUID zoneId, UpdateZoneRequest request) {
        var zone = findZone(zoneId);
        zone.setName(request.name());
        zone.setAddress(request.address());
        zone.setZoneType(request.zoneType());
        zone.setHourlyRate(request.hourlyRate());
        zone.setLatitude(request.latitude());
        zone.setLongitude(request.longitude());
        return ZoneResponse.from(zoneRepository.save(zone));
    }

    // ---- Space management ----

    @Transactional
    public SpaceResponse addSpace(UUID zoneId, CreateSpaceRequest request) {
        var zone = findZone(zoneId);
        var space = new ParkingSpace(zone, request.spaceNumber(), request.floor());
        zone.incrementTotalSpaces();
        zoneRepository.save(zone);
        return SpaceResponse.from(spaceRepository.save(space));
    }

    public List<SpaceResponse> listSpaces(UUID zoneId, SpaceStatus status) {
        List<ParkingSpace> spaces;
        if (status != null) {
            spaces = spaceRepository.findByZoneIdAndStatus(zoneId, status);
        } else {
            spaces = spaceRepository.findByZoneId(zoneId);
        }
        return spaces.stream().map(SpaceResponse::from).toList();
    }

    public List<SpaceResponse> listAvailableSpaces(UUID zoneId) {
        return spaceRepository.findByZoneIdAndStatus(zoneId, SpaceStatus.AVAILABLE)
                .stream().map(SpaceResponse::from).toList();
    }

    @Transactional
    public SpaceResponse updateSpaceStatus(UUID zoneId, UUID spaceId, UpdateSpaceStatusRequest request) {
        var space = findSpace(spaceId);
        if (!space.getZone().getId().equals(zoneId)) {
            throw new IllegalArgumentException("Space does not belong to zone");
        }
        space.setStatus(request.status());
        return SpaceResponse.from(spaceRepository.save(space));
    }

    // ---- Occupancy ----

    public OccupancyResponse getOccupancy(UUID zoneId) {
        findZone(zoneId); // ensure zone exists
        int total = spaceRepository.countByZoneId(zoneId);
        int available = spaceRepository.countByZoneIdAndStatus(zoneId, SpaceStatus.AVAILABLE);
        int occupied = spaceRepository.countByZoneIdAndStatus(zoneId, SpaceStatus.OCCUPIED);
        int reserved = spaceRepository.countByZoneIdAndStatus(zoneId, SpaceStatus.RESERVED);
        int outOfService = spaceRepository.countByZoneIdAndStatus(zoneId, SpaceStatus.OUT_OF_SERVICE);
        return new OccupancyResponse(zoneId, total, available, occupied, reserved, outOfService);
    }

    // ---- Public methods for other modules ----

    @Transactional
    public void reserveSpace(UUID spaceId) {
        var space = findSpace(spaceId);
        if (space.getStatus() != SpaceStatus.AVAILABLE) {
            throw new IllegalStateException("Space is not available for reservation. Current status: " + space.getStatus());
        }
        space.setStatus(SpaceStatus.RESERVED);
        spaceRepository.save(space);
    }

    @Transactional
    public void occupySpace(UUID spaceId) {
        var space = findSpace(spaceId);
        if (space.getStatus() != SpaceStatus.AVAILABLE && space.getStatus() != SpaceStatus.RESERVED) {
            throw new IllegalStateException("Space cannot be occupied. Current status: " + space.getStatus());
        }
        space.setStatus(SpaceStatus.OCCUPIED);
        spaceRepository.save(space);
    }

    @Transactional
    public void releaseSpace(UUID spaceId) {
        var space = findSpace(spaceId);
        if (space.getStatus() != SpaceStatus.OCCUPIED && space.getStatus() != SpaceStatus.RESERVED) {
            throw new IllegalStateException("Space is not occupied or reserved. Current status: " + space.getStatus());
        }
        space.setStatus(SpaceStatus.AVAILABLE);
        spaceRepository.save(space);
    }

    public BigDecimal getHourlyRate(UUID zoneId) {
        return findZone(zoneId).getHourlyRate();
    }

    public String getZoneName(UUID zoneId) {
        return findZone(zoneId).getName();
    }

    public SpaceStatus getSpaceStatus(UUID spaceId) {
        return findSpace(spaceId).getStatus();
    }

    // ---- Internal helpers ----

    private ParkingZone findZone(UUID zoneId) {
        return zoneRepository.findById(zoneId)
                .orElseThrow(() -> new NoSuchElementException("Zone not found: " + zoneId));
    }

    private ParkingSpace findSpace(UUID spaceId) {
        return spaceRepository.findById(spaceId)
                .orElseThrow(() -> new NoSuchElementException("Space not found: " + spaceId));
    }
}
