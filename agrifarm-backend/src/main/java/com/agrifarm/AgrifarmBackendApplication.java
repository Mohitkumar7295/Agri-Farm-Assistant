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
		loadDotEnv();
		SpringApplication.run(AgrifarmBackendApplication.class, args);
	}

	private static void loadDotEnv() {
		java.util.List<java.nio.file.Path> candidates = java.util.List.of(
				java.nio.file.Paths.get(".env"),
				java.nio.file.Paths.get("../.env"),
				java.nio.file.Paths.get("agrifarm-backend/.env")
		);
		for (java.nio.file.Path path : candidates) {
			if (java.nio.file.Files.exists(path)) {
				try {
					java.util.List<String> lines = java.nio.file.Files.readAllLines(path);
					for (String line : lines) {
						line = line.trim();
						if (!line.isEmpty() && !line.startsWith("#") && line.contains("=")) {
							int idx = line.indexOf('=');
							String key = line.substring(0, idx).trim();
							String val = line.substring(idx + 1).trim();
							if (val.startsWith("\"") && val.endsWith("\"") && val.length() >= 2) {
								val = val.substring(1, val.length() - 1);
							}
							if (System.getProperty(key) == null && System.getenv(key) == null) {
								System.setProperty(key, val);
							}
						}
					}
					break;
				} catch (Exception ignored) {
				}
			}
		}
	}

}
