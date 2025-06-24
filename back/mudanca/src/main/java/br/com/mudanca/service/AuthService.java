package br.com.mudanca.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.mudanca.dto.AuthenticationResponse;
import br.com.mudanca.dto.LoginRequest;
import br.com.mudanca.dto.RegisterRequest;
import br.com.mudanca.dto.UserResponse;
import br.com.mudanca.model.ERole; // Importar ERole
import br.com.mudanca.model.Role; // Importar Role
import br.com.mudanca.model.User;
import br.com.mudanca.repository.RoleRepository; // Importar RoleRepository
import br.com.mudanca.repository.UserRepository;
import br.com.mudanca.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already in use");
        }

        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role USER not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        User user = User.builder()
            .username(request.username())
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .roles(roles)
            .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user);
        return new AuthenticationResponse(
            token,
            new UserResponse(user.getId(), user.getUsername(), user.getEmail())
        );
    }

    public AuthenticationResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new RuntimeException("User not found"));

        String token = tokenProvider.generateToken(user);
        return new AuthenticationResponse(
            token,
            new UserResponse(user.getId(), user.getUsername(), user.getEmail())
        );
    }
}