package com.tagit.mrb.custadmin.api.biz.service;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

import com.tagit.commons.core.biz.service.AbstractBizServiceTest;
import com.tagit.mrb.custadmin.api.biz.domain.CustomerAdminRequest;
import com.tagit.mrb.custadmin.api.biz.domain.CustomerAdminResponse;
import com.tagit.mrb.custadmin.api.biz.service.CustomerAdminService;

/**
 * 
 * CustomerAdminServiceTest.
 *
 * @author praveen.s
 * @version $Id: CustomerAdminServiceTest.java 22 Oct, 2020 7:52:55 PM
 *
 * @since 1.0
 */
@SpringBootTest(webEnvironment = WebEnvironment.NONE)
@Tag("unit")
@Tag("service")
public class CustomerAdminServiceTest extends AbstractBizServiceTest<CustomerAdminRequest, CustomerAdminResponse> {

   @BeforeEach
   public void setUp() throws Exception {
      loadBizService(CustomerAdminService.class);
   }

   @Test
   @DisplayName("Test Spring Context wiring")
   public void testWiring() {
      LOG.info("[testWiring] Starting Wiring Test in LocatorAdminServiceTest.class : " + request);
      assertTrue(request instanceof CustomerAdminRequest, "The request is not the correct <REQ> instance.");
      assertTrue(service instanceof CustomerAdminService, "The service is not the correct Biz Service instance.");
      assertTrue(response instanceof CustomerAdminResponse, "The response is not the correct <RES> instance.");
   }

}
