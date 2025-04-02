package com.example.demo;

import org.springframework.boot.SpringApplication;
import com.tagit.commons.core.boot.TagitSpringBootApplication;

/**
 * Sample Spring Boot Application.
 */
@TagitSpringBootApplication
public class DemoApplication {

	/**
	 *  Default constructor.
	 */
	public DemoApplication() {		
	}

	/**
	 *  Sample main-class. 
	 * 
	 *  @param args main arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
