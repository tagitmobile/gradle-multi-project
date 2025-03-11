package com.tagit.mrb.custadmin.api.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import com.tagit.commons.core.web.rest.constants.CommonRestConstants;
import com.tagit.mrb.custadmin.api.constants.Constants;

@SpringBootTest(webEnvironment=WebEnvironment.MOCK) // [rj.added 2018.11.27] For business service integration testing, no need to setup a web environment
@AutoConfigureMockMvc
@TestPropertySource(properties= {"tagit.core.rest.auto-translate-errors=true"})

@Tag("integration") // [rj] Mark this as an integration test
@Tag("rest") // [rj] Mark this as an rest layer test

@ActiveProfiles("test") // [rj] Use the test profile to disable stuff like SwaggerDocs
public class ExceptionControllerTranslationTest {

   @Autowired
   private MockMvc mvc;

   // --------------------------------------------------------------------------------------------------------------
   //
   // GET Methods
   //
   // --------------------------------------------------------------------------------------------------------------
   
   @Test
   @DisplayName("GET " + Constants.API_URL_EXCEPTION_SINGLE + ": Single biz service exception")
   public void testSingle() throws Exception {      
      this.mvc.perform(get(Constants.API_URL_EXCEPTION_SINGLE)
            .header(CommonRestConstants.HEADER_TENANT_ID, "SY")
            .accept(MediaType.APPLICATION_JSON));
//         .andExpect(status().is3xxRedirection());
//         .andExpect(jsonPath("$..feeCode").value(Matchers.contains(containsString(siUuid))));
   }
   
   @Test
   @DisplayName("GET " + Constants.API_URL_EXCEPTION_DEFAULT + ": Single biz service exception with default code")
   public void testDefault() throws Exception {      
      this.mvc.perform(get(Constants.API_URL_EXCEPTION_DEFAULT)
            .header(CommonRestConstants.HEADER_TENANT_ID, "SY")
            .accept(MediaType.APPLICATION_JSON));
//         .andExpect(status().is3xxRedirection());
//         .andExpect(jsonPath("$..feeCode").value(Matchers.contains(containsString(siUuid))));
   }
   
   @Test
   @DisplayName("GET " + Constants.API_URL_EXCEPTION_MULTIPLE + ": Biz service exception with multiple error details")
   public void testMultiple() throws Exception {      
      this.mvc.perform(get(Constants.API_URL_EXCEPTION_MULTIPLE)
            .header(CommonRestConstants.HEADER_TENANT_ID, "SY")
            .accept(MediaType.APPLICATION_JSON));
//         .andExpect(status().is3xxRedirection());
//         .andExpect(jsonPath("$..feeCode").value(Matchers.contains(containsString(siUuid))));
   }
   
   @Test
   @DisplayName("GET " + Constants.API_URL_EXCEPTION_DEFAULT_MULTIPLE + ": Biz service exception with multiple error details and default codes")
   public void testDefaultMultiple() throws Exception {      
      this.mvc.perform(get(Constants.API_URL_EXCEPTION_DEFAULT_MULTIPLE)
            .header(CommonRestConstants.HEADER_TENANT_ID, "SY")
            .accept(MediaType.APPLICATION_JSON));
//         .andExpect(status().is3xxRedirection());
//         .andExpect(jsonPath("$..feeCode").value(Matchers.contains(containsString(siUuid))));
   }
   
   @Test
   @DisplayName("GET " + Constants.API_URL_EXCEPTION_HTTP_STATUS_CODE + ": HttpStatusCodeException Handling")
   public void testHttpStatusCode() throws Exception {      
      this.mvc.perform(get(Constants.API_URL_EXCEPTION_HTTP_STATUS_CODE)
            .header(CommonRestConstants.HEADER_TENANT_ID, "SY")
            .accept(MediaType.APPLICATION_JSON));
//         .andExpect(status().is3xxRedirection());
//         .andExpect(jsonPath("$..feeCode").value(Matchers.contains(containsString(siUuid))));
   }
   
   @Test
   @DisplayName("GET " + Constants.API_URL_EXCEPTION_MESSAGE_ARGUMENTS + ": Biz service exception with message arguments for I18N")
   public void testMessageArgs() throws Exception {      
      this.mvc.perform(get(Constants.API_URL_EXCEPTION_MESSAGE_ARGUMENTS)
            .header(CommonRestConstants.HEADER_TENANT_ID, "SY")
            .accept(MediaType.APPLICATION_JSON));
//         .andExpect(status().is3xxRedirection());
//         .andExpect(jsonPath("$..feeCode").value(Matchers.contains(containsString(siUuid))));
   }
   
   @Test
   @DisplayName("GET " + Constants.API_URL_EXCEPTION_HTTP_STATUS_CODE_MESSAGE_ARGS + ": HttpStatusCodeException Handling with message arguments for I18N")
   public void testHttpStatusCodeMessageArgs() throws Exception {      
      this.mvc.perform(get(Constants.API_URL_EXCEPTION_HTTP_STATUS_CODE_MESSAGE_ARGS)
            .header(CommonRestConstants.HEADER_TENANT_ID, "SY")
            .accept(MediaType.APPLICATION_JSON));
//         .andExpect(status().is3xxRedirection());
//         .andExpect(jsonPath("$..feeCode").value(Matchers.contains(containsString(siUuid))));
   }
}
