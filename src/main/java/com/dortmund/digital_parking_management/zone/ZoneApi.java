package com.dortmund.digital_parking_management.zone;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dortmund.digital_parking_management.zone.dto.*;
import com.dortmund.digital_parking_management.zone.model.SpaceStatus;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/zones")
class ZoneApi {

    private final ZoneService zoneService;

    ZoneApi(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @PostMapping
    ResponseEntity<ZoneResponse> createZone(@Valid @RequestBody CreateZoneRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(zoneService.createZone(request));
    }

    @GetMapping
    List<ZoneResponse> listZones() {
        return zoneService.listZones();
    }

    @GetMapping("/{zoneId}")
    ZoneResponse getZone(@PathVariable UUID zoneId) {
        return zoneService.getZone(zoneId);
    }

    @PutMapping("/{zoneId}")
    ZoneResponse updateZone(@PathVariable UUID zoneId, @Valid @RequestBody UpdateZoneRequest request) {
        return zoneService.updateZone(zoneId, request);
    }

    @PostMapping("/{zoneId}/spaces")
    ResponseEntity<SpaceResponse> addSpace(@PathVariable UUID zoneId, @Valid @RequestBody CreateSpaceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(zoneService.addSpace(zoneId, request));
    }

    @GetMapping("/{zoneId}/spaces")
    List<SpaceResponse> listSpaces(@PathVariable UUID zoneId, @RequestParam(required = false) SpaceStatus status) {
        return zoneService.listSpaces(zoneId, status);
    }

    @GetMapping("/{zoneId}/spaces/available")
    List<SpaceResponse> listAvailableSpaces(@PathVariable UUID zoneId) {
        return zoneService.listAvailableSpaces(zoneId);
    }

    @PatchMapping("/{zoneId}/spaces/{spaceId}/status")
    SpaceResponse updateSpaceStatus(@PathVariable UUID zoneId, @PathVariable UUID spaceId,
                                    @Valid @RequestBody UpdateSpaceStatusRequest request) {
        return zoneService.updateSpaceStatus(zoneId, spaceId, request);
    }

    @GetMapping("/{zoneId}/occupancy")
    OccupancyResponse getOccupancy(@PathVariable UUID zoneId) {
        return zoneService.getOccupancy(zoneId);
    }
}
