package com.mftracker.repository;

import com.mftracker.model.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {

    List<Investment> findByUserId(Long userId);

    List<Investment> findByUserIdOrderByIdDesc(Long userId);

    @Query("SELECT SUM(i.investedAmount) FROM Investment i WHERE i.user.id = :userId")
    BigDecimal getTotalInvestedByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT i.fund.id) FROM Investment i WHERE i.user.id = :userId")
    Long getDistinctFundCountByUserId(@Param("userId") Long userId);

    @Query("SELECT i FROM Investment i WHERE i.user.id = :userId AND i.fund.id = :fundId")
    List<Investment> findByUserIdAndFundId(@Param("userId") Long userId, @Param("fundId") Long fundId);
}
