---
layout: with-nav
class: team
---

# PiGx

<div class="row">
  <img src="img/hex-PIGx-forGenomics.png" class="columns myHex">
  <div class="large-9 columns" markdown="1">
  
PiGx is a collection of reproducible pipelines for genomics data processing and analysis. The pipelines are packaged via GNU Guix and also
available via Docker. It is also possible to run the pipelines if you can set up the proper Conda environment. 


</div></div>

---------------------------------------

### PiGx BS-seq

PiGx BS-seq pipeline analyzes high-throughput bisulfite sequencing results. It has the following capabilities:


##### Alignment results and QC
- Fastqc results per sample
- Alignment stats per sample
##### Methylation and coverage stats per sample
- Histograms for methylation/coverage 
- scatterplots for pairwise comparisons of samples
- Hierarchical clustering and PCA plots 
- Bigwig files for methylation percent
- Tabix files for methylation call results
- .rds files for methylKit objects
##### Segmentation results and their annotation per sample
- Bed files for segments
- promoter/intron/exon/intergenic annotation for segments
- .rds files for methylKit objects
##### Differential methylation results and their annotation (optional)
- bed/bedgraph files for differential methylation results
- .rds files for methylKit objects
- promoter/intron/exon/intergenic annotation for differentially methylated bases/regions

---------------------------------------
