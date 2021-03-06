---
layout: with-nav
---

# Master’s/Internship projects 
[BIMSB Bioinformatics platform](http://bioinformatics.mdc-berlin.de) has multiple project themes available for Master’s or internship projects. Applicants must have the relevant background for each project. 


### Research Software sustainability 
Reproducibility of scientific workflows is a general problem across all fields of science including computation and data 
analysis heavy fields (see [1](http://science.sciencemag.org/content/334/6060/1226) for reference). For data analysis or computational work it is desirable to install the exact same version as 
published research software in order to enable reproduction of published data and controlled manipulation or augmentation 
of the software system. At the MDC, we have been using GNU Guix for more than three years to build scientific software at different 
versions and variants, and to manage software environments in a reproducible fashion. We have also team members who 
are main contributors to the GNU Guix project. We are looking for new members who can help improve our workflow.
Our goal is to implement a system based on [GNU Guix](https://www.gnu.org/software/guix/manual/html_node/Package-Management.html) 
and [Cuirass](http://git.savannah.nongnu.org/cgit/guix/guix-cuirass.git), by which we can build a wide range of scientific software continuously and 
automatically in a bit-for-bit reproducible fashion and offer the build results to Guix users.

#### Specific tasks
- Develop Cuirass as a production quality platform for continuous integration (CI) with Guix.
- Set up a public service to continuously build and deploy software, offer for download, and archive packages and 
package variants with Guix and Cuirass.
- Investigate and patch sources of non-determinism in software packages offered through Guix.

#### What will you get out of this?
* You will learn about continuous integration and software deployment
* You will learn about and improve a state-of-the-art implementation of a functional package manager
* You will contribute to improving the state of software reproducibility
* You will learn about setting up and running production-level web services
* You will get to contribute to one of the most welcoming projects under the GNU umbrella
* You will get to work with experienced free software hackers

#### What do you need to know?
* Familiarity with building and patching source code (GNU make, diff, patch)
* Basic knowledge of version control with Git
* Knowledge of HTTP and RESTful APIs
* You need to be comfortable with the GNU+Linux command line interface
* Experience with Scheme (or another Lisp) is beneficial but not required.  Familiarity with functional programming is a big plus.

#### Contact
Please contact ricardo.wurmus@mdc-berlin.de or altuna.akalin@mdc-berlin.de for this project

### Other projects
#### 1) Methods for DNA modification analysis
DNA methylation and other DNA modifications such as hydroxymethylation are implicated in gene regulation and their mis- regulation is shown to cause cancer. With the advent of then next- generation sequencing, measuring genome-wide DNA methylation levels became possible. However, this also created a demand for high-quality software for analysis of large-scale DNA methylation data sets. In this project, the aim is to help develop data processing, machine learning and statistical modeling tools for DNA methylation analysis to be integrated to our existing software methylKit (https://code.google.com/p/methylkit/)

_Multiple sub-projects available_

#### 2) Methods for genomics data integration and visualization
Data integration and processing is a vital tool in genomics for knowledge discovery. The number of public datasets are increasing by the day thanks to multiple large consortiums producing genomics data sets, such as ENCODE, Roadmap Epigenomics and EU Blueprint. We are building data integration and visualization methods. One example is our genomation package (http://www.bioconductor.org/packages/devel/bioc/html/genomation .html). The aim of the projects in this theme is to further develop genomation or other unpublished packages adding new methods and increasing data processing and visualization capabilities.

_Multiple sub-projects available_

#### 3) Pure data analysis projects
Our lab has broad interest in gene regulation and epigenomics. We have more data analysis oriented projects that require less method development but more data processing, integration and applied statistics.

_Multiple sub-projects available_

#### 4) Developing bioinformatics tools and workflows for [Galaxy](https://usegalaxy.org/)
We are also aiming to integrate and develop BIMSB bioinformatics tools to Galaxy framework. These projects will include integrating tools with galaxy and making complete workflows where the user can interact through a web-browser. 

_Multiple sub-projects available_

#### What do you need to know?
* Knowledge of R. Experience with another programming language such as perl, python or C/C+ will be useful but not necessary. For some sub-projects, C/C++ will be absolutely necessary on top of R. In addition, previous coursework on statistics and programming will be helpful.
* For galaxy related work, knowledge of web technologies and scripting languages such as Perl/Python.

#### What will you get out of this?
* You will get a chance to work with genomics data sets
* You will learn how to build and maintain an R package (depending on the project)
* You will gain experience in applied statistical modeling (depending on the project)
* You will gain experience in building tools for galaxy (depending on the project)
* If your work is accepted as part of the software and/or ends up in a publication, you will be credited as contributor.




