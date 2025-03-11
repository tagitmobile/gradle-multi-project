package com.tagit.mrb.custadmin.api.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * 
 * CustomerAdminControllerTest.
 *
 * @author gayathri.jeganath
 * @version $Id: CustomerAdminControllerTest.java 24 Oct, 2020 8:27:23 PM
 *
 * @since 7.0
 */
@SpringBootTest(webEnvironment = WebEnvironment.MOCK)

@AutoConfigureMockMvc

@Tag("integration")
@Tag("rest")

public class CustomerAdminControllerTest {

   @Autowired
   private MockMvc mvc;

   @Test
   @DisplayName("/api/customers/viewCustomers/{mcifuuid:: View Customer details")
   @Transactional
   @Rollback(false)
   public void testCustomerDetails() throws Exception {
      this.mvc.perform(get("/api/customers/viewCustomers/A5EDD3B9D8C733BBD15717C7EC61102B").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

   }
   
   @Test
   @DisplayName("/api/customers/viewCustomers/{mcifuuid:: View Customer details")
   @Transactional
   @Rollback(false)
   public void testCustomerActivationDetails() throws Exception {
      this.mvc.perform(get("/api/customers/activation/viewCustomerActivation/A5EDD3B9D8C733BBD15717C7EC61102B").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk());

   }

}
