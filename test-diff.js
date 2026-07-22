const words1 = ['nama', 'tempat', 'tanggal', 'lahir', 'alamat'];
const words2 = ['nama', 'khairan', 'tempat', 'tanggal', 'lahir', 'banjarmasin', 'alamat'];

const m = words1.length;
const n = words2.length;
const dp = new Int32Array((m + 1) * (n + 1));
for (let i = 1; i <= m; i++) {
  for (let j = 1; j <= n; j++) {
    if (words1[i-1] === words2[j-1]) {
      dp[i * (n + 1) + j] = dp[(i-1) * (n + 1) + (j-1)] + 1;
    } else {
      dp[i * (n + 1) + j] = Math.max(dp[(i-1) * (n + 1) + j], dp[i * (n + 1) + (j-1)]);
    }
  }
}

const added = [];
let i_lcs = m, j_lcs = n;
while (i_lcs > 0 || j_lcs > 0) {
  if (i_lcs > 0 && j_lcs > 0 && words1[i_lcs-1] === words2[j_lcs-1]) {
    i_lcs--; j_lcs--;
  } else if (j_lcs > 0 && (i_lcs === 0 || dp[i_lcs * (n + 1) + (j_lcs-1)] >= dp[(i_lcs-1) * (n + 1) + j_lcs])) {
    added.push(words2[j_lcs-1]);
    j_lcs--;
  } else if (i_lcs > 0 && (j_lcs === 0 || dp[i_lcs * (n + 1) + (j_lcs-1)] < dp[(i_lcs-1) * (n + 1) + j_lcs])) {
    i_lcs--;
  }
}
console.log("Added:", added.reverse());
