# gradle-multi-project
Template for Multi-Project Gradle Workspaces to implement the best practice in PPDG eDocs.

![image](https://github.com/user-attachments/assets/cc7bde8f-7027-498b-890e-0fb03dc71e7e)

## Sample Project Structure

Executing `gradlew projects` will list the sub-projects in this Multi-Product Gradle workspace.

> If you have local nexus running on `localhost:8081`, you can build locally by using `gradlew -Dlocal`.

```
> Task :projects

Projects:

------------------------------------------------------------
Root project 'sample-services' - Sample Multi-Project Build
------------------------------------------------------------

Root project 'sample-services' - Sample Multi-Project Build
+--- Project ':common' - Project Common Module
|    +--- Project ':common:common-batch' - Common Batch
|    +--- Project ':common:common-core' - Common Core
|    +--- Project ':common:common-host-integration' - Common Host Integration
|    +--- Project ':common:common-mapper' - Common Mapper
|    \--- Project ':common:common-template' - Common Template
+--- Project ':module1' - Project Module 1
|    +--- Project ':module1:module1-batch' - Module 1 Batch
|    +--- Project ':module1:module1-core' - Module 1 Core
|    +--- Project ':module1:module1-host-integration' - Module 1 Host Integration
|    +--- Project ':module1:module1-mapper-mobile' - Module 1 Mapper
|    +--- Project ':module1:module1-mapper-web' - Module 1 Mapper
|    \--- Project ':module1:module1-template' - Module 1 Template
+--- Project ':module2' - Project Module 2
|    +--- Project ':module2:module2-batch' - Module 2 Batch
|    +--- Project ':module2:module2-core' - Module 2 Core
|    +--- Project ':module2:module2-host-integration' - Module 2 Host Integration
|    +--- Project ':module2:module2-mapper-mobile' - Module 2 Mapper
|    +--- Project ':module2:module2-mapper-web' - Module 2 Mapper
|    \--- Project ':module2:module2-template' - Module 2 Template
\--- Project ':module3-api' - Project Module 3 with Spring Boot API sub-module
     +--- Project ':module3-api:module3-api-api' - Module 3 API (a Spring Boot Application)
     +--- Project ':module3-api:module3-api-core' - Module 3 Core
     \--- Project ':module3-api:module3-api-host-integration' - Module 3 Host Integration

To see a list of the tasks of a project, run gradlew <project-path>:tasks
```

## How to Use This Template

1. Fork this project
1. Open `settings.gradle` and modify `rootProject.name` to your project name.
1. Open `gradle.properties` and modify the relevant properties accordingly such as the project version or project group for publishing to Nexus.
1. Rename the `module1` and `module2` directories accordingly along with the `module1.gradle` and `module2.gradle` to your desired artifact name with prefix. Ensure that the sub-module directories and gradle files are also renamed, i.e. `module1-core` and `module1-core.gradle`, etc.

     For example: 
     - `abc-casa`, `abc-casa.gradle`, `abc-casa-batch`, `abc-casa-core`, `abc-casa-host-integration`, `abc-casa-mapper` and `abc-casa-template` for `module1`
     - `abc-fund-transfer`, `abc-fund-transfer.gradle`, `abc-fund-transfer-batch`, `abc-fund-transfer-core`, `abc-fund-transfer-host-integration`, `abc-fund-transfer-mapper` and `abc-fund-transfer-template` for `module2`
     - and so on...
   
   NOTE: The prefix must be consistent across your project.    

1. Modify the dependencies of the modules in the `.gradle` files. Cross-module dependency can be defined by following https://docs.gradle.org/current/userguide/declaring_dependencies_between_subprojects.html#sec:project_jar_dependencies Gradle sub-project dependency guidelines.
1. If necessary, create more module directories by replicating `module1` or `module2` and renaming them accordingly.


