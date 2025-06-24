package br.com.mudanca.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.mudanca.model.ERole;
import br.com.mudanca.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(ERole name);
	boolean existsByName(ERole name);
}
