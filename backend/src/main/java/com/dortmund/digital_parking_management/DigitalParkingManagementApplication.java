package com.dortmund.digital_parking_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.modulith.Modulithic;

@SpringBootApplication
@Modulithic(sharedModules = "shared")
public class DigitalParkingManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(DigitalParkingManagementApplication.class, args);
	}

}
