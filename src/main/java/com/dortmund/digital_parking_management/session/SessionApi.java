package com.dortmund.digital_parking_management.session;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dortmund.digital_parking_management.session.dto.SessionResponse;
import com.dortmund.digital_parking_management.session.dto.StartSessionRequest;
import com.dortmund.digital_parking_management.session.model.SessionStatus;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sessions")
class SessionApi {

    private final SessionService sessionService;

    SessionApi(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/start")
    ResponseEntity<SessionResponse> startSession(@Valid @RequestBody StartSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.startSession(request));
    }

    @PostMapping("/{sessionId}/stop")
    SessionResponse stopSession(@PathVariable UUID sessionId) {
        return sessionService.stopSession(sessionId);
    }

    @GetMapping("/{sessionId}")
    SessionResponse getSession(@PathVariable UUID sessionId) {
        return sessionService.getSession(sessionId);
    }

    @GetMapping
    List<SessionResponse> listSessions(@RequestParam UUID userId,
                                       @RequestParam(required = false) SessionStatus status) {
        return sessionService.listSessions(userId, status);
    }
}
