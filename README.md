# gradle-multi-project
Template for Multi-Project Gradle Workspaces to implement the best practice in PPDG eDocs.

![image](https://github.com/user-attachments/assets/cc7bde8f-7027-498b-890e-0fb03dc71e7e)

## Sample Project Structure

Executing `gradlew projects` will list the sub-projects in this Multi-Product Gradle workspace.

> If you have local nexus running on `localhost:8081`, you can build locally by using `gradlew -Dlocal`. Refer to https://edocs1.tagitmobile.com/confluence/display/PPDG/Local+Environment+-+Nexus+Repository+Manager+NXRM on how to setup your own local Nexus so you do not need to be connected to Tagit VPN to access Tagit's Central Nexus all the time.

```
> Task :projects

Projects:

------------------------------------------------------------
Root project 'proj-sample-services' - Sample Multi-Project Build
------------------------------------------------------------

Root project 'proj-sample-services' - Sample Multi-Project Build
+--- Project ':proj-common' - Project Common Module
|    +--- Project ':proj-common:proj-common-batch' - Common Batch
|    +--- Project ':proj-common:proj-common-core' - Common Core
|    +--- Project ':proj-common:proj-common-host-integration' - Common Host Integration
|    +--- Project ':proj-common:proj-common-mapper' - Common Mapper
|    \--- Project ':proj-common:proj-common-template' - Common Template
+--- Project ':proj-module1' - Project Module 1
|    +--- Project ':proj-module1:proj-module1-batch' - Module 1 Batch
|    +--- Project ':proj-module1:proj-module1-core' - Module 1 Core
|    +--- Project ':proj-module1:proj-module1-host-integration' - Module 1 Host Integration
|    +--- Project ':proj-module1:proj-module1-mapper-mobile' - Module 1 Mapper
|    +--- Project ':proj-module1:proj-module1-mapper-web' - Module 1 Mapper
|    \--- Project ':proj-module1:proj-module1-template' - Module 1 Template
+--- Project ':proj-module2' - Project Module 2
|    +--- Project ':proj-module2:proj-module2-batch' - Module 2 Batch
|    +--- Project ':proj-module2:proj-module2-core' - Module 2 Core
|    +--- Project ':proj-module2:proj-module2-host-integration' - Module 2 Host Integration
|    +--- Project ':proj-module2:proj-module2-mapper-mobile' - Module 2 Mapper
|    +--- Project ':proj-module2:proj-module2-mapper-web' - Module 2 Mapper
|    \--- Project ':proj-module2:proj-module2-template' - Module 2 Template
+--- Project ':proj-module3-api' - Project Module 3 with Spring Boot API sub-module
|    +--- Project ':proj-module3-api:proj-module3-api-api' - Module 3 API (a Spring Boot Application)
|    +--- Project ':proj-module3-api:proj-module3-api-core' - Module 3 Core
|    \--- Project ':proj-module3-api:proj-module3-api-host-integration' - Module 3 Host Integration
\--- Project ':proj-module4-admin' - Project Module 3 with Spring Boot API sub-module
     +--- Project ':proj-module4-admin:proj-module4-admin-adm' - Module 4 Admin (a Spring Boot and Angular Application)
     +--- Project ':proj-module4-admin:proj-module4-admin-core' - Module 4 Core
     \--- Project ':proj-module4-admin:proj-module4-admin-host-integration' - Module 4 Host Integration

To see a list of the tasks of a project, run gradlew <project-path>:tasks
```

## How to Use This Template

1. Fork this project
1. Open `settings.gradle` and modify `rootProject.name` to your project name.
1. Open `gradle.properties` and modify the relevant properties accordingly such as the project version or project group for publishing to Nexus.
1. Rename the `proj-module1` and `proj-module2` directories accordingly along with the `proj-module1.gradle` and `proj-module2.gradle` to your desired artifact name with prefix. Ensure that the sub-module directories and gradle files are also renamed, i.e. `proj-module1-core` and `proj-module1-core.gradle`, etc.

     For example: 
     - `abc-casa`, `abc-casa.gradle`, `abc-casa-batch`, `abc-casa-core`, `abc-casa-host-integration`, `abc-casa-mapper` and `abc-casa-template` for `proj-module1`
     - `abc-fund-transfer`, `abc-fund-transfer.gradle`, `abc-fund-transfer-batch`, `abc-fund-transfer-core`, `abc-fund-transfer-host-integration`, `abc-fund-transfer-mapper` and `abc-fund-transfer-template` for `proj-module2`
     - and so on...
   
   NOTE: Renaming with `proj` project alias prefix with your own project alias. In this case, the prefix `abc` must be consistent across the ABC project.

1. Modify the dependencies of the modules in the `.gradle` files. Cross-module dependency can be defined by following https://docs.gradle.org/current/userguide/declaring_dependencies_between_subprojects.html#sec:project_jar_dependencies Gradle sub-project dependency guidelines.
1. If necessary, create more module directories by replicating `proj-module1` or `proj-module2` and renaming them accordingly.


