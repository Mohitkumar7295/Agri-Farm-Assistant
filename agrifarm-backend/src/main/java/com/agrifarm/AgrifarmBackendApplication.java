package com.agrifarm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = {
		"org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration",
		"org.springframework.boot.jdbc.autoconfigure.DataSourceTransactionManagerAutoConfiguration",
		"org.springframework.boot.orm.jpa.autoconfigure.HibernateJpaAutoConfiguration",
		"org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration",
		"org.springframework.boot.batch.autoconfigure.BatchAutoConfiguration"
})
public class AgrifarmBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgrifarmBackendApplication.class, args);
	}

}
