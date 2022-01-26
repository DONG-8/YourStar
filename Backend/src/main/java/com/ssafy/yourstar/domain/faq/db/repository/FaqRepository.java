package com.ssafy.yourstar.domain.faq.db.repository;

import com.ssafy.yourstar.domain.faq.db.entity.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Integer> {
    Page<Faq> findAll(Pageable pageable);
}
