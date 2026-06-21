# Image Diff Viewer

21st June 2026

A few days ago I wrote a basic Merkle tree implementation. Today, I built an image diff viewer on top of it.

The idea: chunk an image into a grid of tiles, index them with a Merkle tree, and diff two images by comparing their trees. Differing tiles get flagged and masked in the output. Pre-build the index once, and every subsequent comparison is `O(log n)` instead of `O(n)`.

Benchmark on a ~5 MB image: brute force takes 0.024s per comparison. Merkle tree takes 0.000056s against a cached index. ~443x faster.

Code: https://github.com/saranshabd/merkle-trees/tree/master/image_diff_viewer
