import{j as a,D as s,a7 as r,d as l,V as i,m,q as o,_ as p}from"./chunk-449c23a2.js";import{_ as d}from"../entries/src_pages_Home.page.16dc467b.js";import"./chunk-a740628f.js";import"./chunk-cf010ec4.js";import"./chunk-ee54c1e8.js";const g={class:"markdown-body"},h=r(`<h2>Configuration</h2><p>Set the global config</p><pre><code class="language-shell">git config --global user.name &quot;[name]&quot;
git config --global user.email &quot;[email]&quot;
</code></pre><h2>Get started</h2><p>Create a git repository</p><pre><code class="language-shell">git init
</code></pre><p>Clone an existing git repository</p><pre><code class="language-shell">git clone [url]
</code></pre><h2>Commit</h2><p>Commit all tracked changes</p><pre><code class="language-shell">git commit -am &quot;[commit message]&quot;
</code></pre><p>Add new modifications to the last commit</p><pre><code class="language-shell">git commit --amend --no-edit
</code></pre><h2>I’ve made a mistake</h2><p>Change last commit message</p><pre><code class="language-shell">git commit --amend
</code></pre><p>Undo most recent commit and keep changes</p><pre><code class="language-shell">git reset HEAD~1
</code></pre><p>Undo the <code>N</code> most recent commit and keep changes</p><pre><code class="language-shell">git reset HEAD~N
</code></pre><p>Undo most recent commit and get rid of changes</p><pre><code class="language-shell">git reset HEAD~1 --hard
</code></pre><p>Reset branch to remote state</p><pre><code class="language-shell">git fetch origin
git reset --hard origin/[branch-name]
</code></pre><h2>Miscellaneous</h2><p>Renaming the local master branch to main</p><pre><code class="language-shell">git branch -m master main
</code></pre>`,27),_=[h],u={__name:"git-memo.content",setup(c,{expose:e}){return e({frontmatter:{}}),(n,b)=>(a(),s("div",g,_))}},f=l({__name:"git-memo",setup(c){i(t=>({"8cb22b3c":o(e).cardColor}));const e=d();return(t,n)=>(a(),s("div",null,[m(o(u))]))}});const V=p(f,[["__scopeId","data-v-c7dbeca3"]]);export{V as default};
