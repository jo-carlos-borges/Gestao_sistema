package br.com.mudanca.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import br.com.mudanca.model.ERole;
import br.com.mudanca.model.Role;
import br.com.mudanca.model.User;
import br.com.mudanca.repository.RoleRepository;
import br.com.mudanca.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (!roleRepository.existsByName(ERole.ROLE_ADMIN)) {
            roleRepository.save(Role.builder().name(ERole.ROLE_ADMIN).build());
        }
        if (!roleRepository.existsByName(ERole.ROLE_USER)) {
            roleRepository.save(Role.builder().name(ERole.ROLE_USER).build());
        }

        if (userRepository.count() == 0) {
            System.out.println("Nenhum usuário encontrado. Criando usuário ADMIN padrão...");

            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            User adminUser = User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(roles)
                    .build();

            userRepository.save(adminUser);
            System.out.println("Usuário ADMIN padrão criado com sucesso!");
        } else {
            System.out.println("Usuários já existem. Nenhum usuário padrão será criado.");
        }
    }
}