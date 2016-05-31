---
layout: with-nav
---

# Resources

Here is a list of software, databases and learning material maintained
by bioinformatics platform members.

-----------------------------------------

### Databases & Web Apps

##### **doRiNA**

[DoRiNA](http://dorina.mdc-berlin.de/) is a database for RNA binding
protein binding sites and microRNAs.

##### **UCSC browser mirror**
We are maintaining a UCSC mirror with limited number of species. You can see reach it via [http://genome.mdc-berlin.de](http://genome.mdc-berlin.de). We also provide [web space](http://bimsbstatic.mdc-berlin.net) (the link is accessible only from MDC network) for static htmls and Track hub data for UCSC browser. Contact [Dan Munteanu](http://bioinformatics.mdc-berlin.de/team.html#dan-munteanu) for more info.

##### **Internal Galaxy Server**
We are currently setting up a local version of Galaxy framework. 

-----------------------------------------

### Software

##### **methylKit**

methylKit is an R package for DNA methylation analysis and annotation
from high-throughput bisulfite sequencing. The package is designed to
deal with sequencing data from RRBS and its variants, but also
target-capture methods such as Agilent SureSelect methyl-seq. In
addition, methylKit can deal with base-pair resolution data for 5hmC
obtained from Tab-seq or oxBS-seq. It can also handle whole-genome
bisulfite sequencing data if proper input format is provided.

[[https://code.google.com/p/methylkit]](https://code.google.com/p/methylkit/)

##### **genomation**

This is an R package that contains a collection of tools for
visualizing and analyzing genome-wide data sets. The package works
with a variety of genomic interval file types and enables easy summary
and annotation of high throughput data sets with given genomic
annotations.

[[http://bioinformatics.mdc-berlin.de/genomation/]](http://bioinformatics.mdc-berlin.de/genomation/)

##### **RCAS**

RNA Centric Annotation System (RCAS) is an R package that provides
    dynamic annotations with interactive figures and tables for custom input files 
    that contain transcriptomic target regions. Such transcriptomic target regions 
    could be, for instance, peak regions detected by CLIP-Seq analysis that detect 
    protein-RNA interactions, MeRIP-Seq analysis that detect RNA modifications 
    (alias the epitranscriptome), or any collection of target regions at the level of 
    the transcriptome. RCAS overlays the input target regions with the annotated gene 
    features and generates a variety of summary plots. Furthermore, RCAS enables GO term 
    and gene set enrichment analyses based on targeted genes.  

##### **github repository**
We try to develop software in the open as much as we can. You can reach our repository here:

[[https://github.com/BIMSBbioinfo/]](https://github.com/BIMSBbioinfo/)

-----------------------------------------

### Other IT services
The platform has additional IT responsibilities. Some of those are listed below for reference. 

- BIMSB cluster maintenance
- Linux workstation support
- Customized software installation and packaging with [Guix](http://www.gnu.org/software/guix/), see list of available bioinformatics software [here](http://guix.mdc-berlin.de/packages?/?search=bioinfo).
- Maintain and set up virtual machines running databases and web apps
- Backups (sequencing data, Linux workstations, puppet data)
- BIMSB user support: send an e-mail to [helpdesk@mdc-berlin.de](helpdesk@mdc-berlin.de) for IT related requests
  - Unix + Grid Engine trainings, see [Training](http://bioinformatics.mdc-berlin.de/training.html) and [Learning Materials](http://bioinformatics.mdc-berlin.de/resources.html#learning-materials)
  - Processing sequencing data restore requests
  - Cluster problems
  - Triaging file access issues

- Installation / configuration / maintenance for BIMSB apps servers (the physical machines)

-----------------------------------------


### Learning materials

##### **Introduction to Unix and SGE (Sun Grid Engine)**
This is a resource maintained and developed by platform members.

[[http://bioinformatics.mdc-berlin.de/intro2UnixandSGE/]](http://bioinformatics.mdc-berlin.de/intro2UnixandSGE/)

##### **How to use the BIMSB cluster**
Some specifics about BIMSB cluster

[[https://bbc.mdc-berlin.de/howto/cluster]](https://bbc.mdc-berlin.de/howto/cluster)

##### **Notes on Computational Genomics with R**
This is a resource developed by Dr.Akalin. Currently, it includes the basics of R and genomic interval analysis using R/Bioconductor packages. More to be added...

[[http://al2na.github.io/compgenr/]](http://al2na.github.io/compgenr/)


