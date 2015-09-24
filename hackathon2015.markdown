---
layout: event
---

<h1>Bio<span style="color:#fff">informatics</span> Hackathon <span style="color:#fff">2015</span></h1>

![hackathon graphic](/img/hackathon-2015.png)

[MDC/BIMSB](https://www.mdc-berlin.de/13800178/en/bimsb) [Bioinformatics platform](http://bioinformatics.mdc-berlin.de) has organised a bioinformatics hackathon with support from
RNA Bioinformatics Center (de.NBI) and venue support from IRI Life
sciences from **September 14th to 15th 2015** (2 days).

The event was for students, postdocs and investigators who are already
making and using bioinformatics tools.  Participants were encouraged to
work on problems related to RNA bioinformatics, though other
bioinformatics research problems were also welcome. There was no restriction 
on which programming languages or frameworks (such as galaxy) are used for development 
as long as developed tools are open source. 


## Organization

After a brief brainstorming session individuals or teams pitched
their ideas.  In tota, 3 teams were formed and they
spent two days making a pipeline or a tool that solves a particular
bioinformatics problem.  The hackathon will took place at
IRI, Philippstr. 13, Haus 18 / Top Floor 10115 Berlin.

## Results

During the bioinformatics hackaton, participants prototyped three different projects.
With a more biological focus, the first project looked at the Influence of
long non coding RNAs on splicing.  The second project centered on developing a
system for producing automated tutorials for the Galaxy platform, while the
third project focused on integrating an interactive genome browser into the
Bioconductor computing environment.

### Project: LINC_SPLICE

#### Background and Motivation

Long non-coding RNAs (lncRNAs) have a variety of roles in post-transcriptional
regulation. Binding of lncRNAs to target (pre)mRNA molecules regulate the
stability, rate of decay and/or translation, and alternative splicing
(PMID:24105322). In this project, we are interested in the impact of lincRNAs
on the alternative splicing of pre-mRNA products. lincRNAs encoded in the
anti-sense strand of a gene can make anti-sense pairing and regulate the
alternative splicing of its target pre-mRNA products. Such binding of lncRNAs
to nearby regions of splice sites may lead to inhibition of the spliceosome
machinery to remove an intron (intron retention) (PMID: 18347095), or blocking
of both splice sites flanking an exon may lead to skipping of the exon (PMID:
11468272). Thus lncRNA regulation of alternative splicing confers a functional
diversity onto its target genes.


Alternative splicing is an important regulatory mechanism often found in
eukaryotes and deregulations in the expression levels of alternative isoforms
of a gene are frequently involved in human diseases
(PMID:15122293). Therefore, an improved understanding of how lncRNAs could
regulate the alternative splicing events could be a valuable contribution for
both the diagnosis and treatment strategies that involve rescuing of
alternative splicing products deregulated in diseases (e.g. PMID: 21686247).


#### Methods

Our strategy of linking lncRNAs to their potential target pre-mRNAs consists
of two main steps:

1. Mapping of lncRNA sequences against known intron-exon boundaries to
   classify the potential impact of lncRNA binding on its target pre-mRNA
   molecules: a) intron retention (if the lncRNA blocks a single splice
   junction b) exon skipping (if the lncRNA blocks both splice junctions
   flanking an exon).

2. Correlating the expression levels of lncRNAs with the expression levels of
   their target splice junction regions. If the target event is an intron
   retention event; we would expect an increase in the expression level of the
   intronic region surrounding the splice site. On the other hand, if the
   target event is an exon skipping event, we would expect to see a negative
   correlation between the lncRNA expression and the exon’s expression.


#### Results

Within the two days of the hackathon, we were able to get a list of candidate
target binding sites of lncRNAs and classify their potential impact as exon
skipping or intron retention events. Thus, we could obtain a bi-partite graph
of lncRNA-splice site interactions.

However, most of the interactions (98%) we found were between pre-mRNAs and
anti-sense lncRNAs encoded at the overlapping genomic regions; suggesting that
the alignment score thresholds may have been too strict. Moreover, we were
able to develop R scripts to obtain expression levels of two sets of genomic
coordinates, where the first set consists of the genomic coordinates of the
lncRNAs and the second set corresponds to their target binding genomic
regions.


#### Future Directions

By the end of the hackathon, we agreed that we would need to re-do the lncRNA
alignments with a more relaxed setting to obtain more potential candidates.
Using these candidates, we will apply the R scripts that we developed to
correlate lncRNA activity with their target splice sites using publicly
available genome-wide coverage data in repositories such as GEO and
ArrayExpress.

#### Links

* [Hackathon presentation](https://www.dropbox.com/s/93yo898218xzz59/linc-splice.pptx?dl=0)
* [Project on GitHub](https://github.com/holtgrewe/linc_splice/)


### Project: Interactive tutorials for the Galaxy platform

[Galaxy](http://usegalaxy.org) is a standalone web application for analysis of
biological data.  The biggest advantage of the Galaxy platform is that it
greatly empowers researchers with little or no skill in biological
computation, to do high quality complex data analysis, which can be saved,
shared and completely reproduced.  The current limit in the scope of the
Galaxy platform is that in order to use the tool, researchers most often
require a hands-on training.

We focused on developing stand-alone tutorials using
[Intro.js](https://usablica.github.io/intro.js/). The tutorials would be
topic-specific and enable the researcher to educate themselves about the
proper ways of doing analysis of biological data, without having a personal
tutor.  We hope that this would greatly expand the usage of the Galaxy
platform and the reproducibility of biological science.


### Project: [Interactive genome browser](https://github.com/uhlitz/gbdr)

Analysis of high throughput biological data can be error prone and difficult,
due to the varying quality of the produced data.  The fastest and robust way
of quality control during the analysis is a visual confirmation that the
computational methods have enough power to separate the signal from the noise.

A standard way of representing biological data is to overlay different layers
upon the genome in a form of a genome browser.  Currently there is no
application which would support simultaneous analysis and data visualization.

Because of that we decided to implement an interactive genome browser that can
be used within the R programming environment.  We used the
[Dalliance standalone genome browser written in JavaScript](https://github.com/dasmoth/dalliance),
and optimized the R interface to the JavaScript code to enable the usage of
the browser by R directly.  In two days we produced a working browser which
supports genomic file formats, and most commonly used data types.

#### Links
* [Project on GitHub](https://github.com/uhlitz/gbdr)



<hr/>
<div class="row">
  <div class="large-4 columns">
    <img src="/img/logo-bimsb-white.png">
  </div>
  <div class="large-4 columns">
    <img src="/img/logo-deNBI.png">
  </div>
  <div class="large-4 columns">
    <img src="/img/logo-iri.png">
  </div>
</div>
