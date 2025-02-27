package com.example.demo;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 *  ServletInitializer. 
 */
public class ServletInitializer extends SpringBootServletInitializer {

	/**
	 *  Default constructor.
	 */
	public ServletInitializer() {		
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(DemoApplication.class);
	}

}
