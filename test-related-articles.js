const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3002';

async function testRelatedArticles() {
  try {
    console.log('Testing Related Articles Functionality...\n');

    // Test 1: Get all articles to see current state
    console.log('1. Fetching all articles...');
    const articlesResponse = await fetch(`${API_BASE}/api/blog/articles`);
    const articlesData = await articlesResponse.json();
    
    if (articlesData.success && articlesData.data.articles.length > 0) {
      console.log(`Found ${articlesData.data.articles.length} articles`);
      
      // Get the first two articles for testing
      const firstArticle = articlesData.data.articles[0];
      const secondArticle = articlesData.data.articles[1];
      
      console.log(`First article: ${firstArticle.title} (ID: ${firstArticle.id})`);
      console.log(`Second article: ${secondArticle.title} (ID: ${secondArticle.id})`);
      
      // Test 2: Get a specific article to see related articles
      console.log(`\n2. Fetching article: ${firstArticle.title}`);
      
      const articleResponse = await fetch(`${API_BASE}/api/blog/articles/${firstArticle.id}`);
      const articleData = await articleResponse.json();
      
      if (articleData.success) {
        console.log(`Article found: ${articleData.data.article.title}`);
        console.log(`Related articles count: ${articleData.data.article.relatedArticles?.length || 0}`);
        
        if (articleData.data.article.relatedArticles?.length > 0) {
          console.log('Related articles:');
          articleData.data.article.relatedArticles.forEach((related, index) => {
            console.log(`  ${index + 1}. ${related.title} (${related.category})`);
          });
        } else {
          console.log('No related articles found (this might be expected if none are set)');
        }
      } else {
        console.log('Failed to fetch article:', articleData.message);
        return;
      }
      
      // Test 3: Try to update an article with related articles
      console.log('\n3. Testing article update with related articles...');
      
      if (secondArticle) {
        const updateData = {
          relatedArticles: [secondArticle.id]
        };
        
        console.log(`Updating article "${firstArticle.title}" with related article: "${secondArticle.title}"`);
        
        const updateResponse = await fetch(`${API_BASE}/api/blog/articles/${firstArticle.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
        
        const updateResult = await updateResponse.json();
        
        if (updateResult.success) {
          console.log('Article updated successfully!');
          
          // Test 4: Verify the update worked
          console.log('\n4. Verifying the update...');
          const verifyResponse = await fetch(`${API_BASE}/api/blog/articles/${firstArticle.id}`);
          const verifyData = await verifyResponse.json();
          
          if (verifyData.success) {
            console.log(`Updated article related articles count: ${verifyData.data.article.relatedArticles?.length || 0}`);
            if (verifyData.data.article.relatedArticles?.length > 0) {
              console.log('Related articles after update:');
              verifyData.data.article.relatedArticles.forEach((related, index) => {
                console.log(`  ${index + 1}. ${related.title} (${related.category})`);
              });
              
              // Check if the related article was actually added
              const hasRelatedArticle = verifyData.data.article.relatedArticles.some(ra => ra.slug === secondArticle.slug);
              if (hasRelatedArticle) {
                console.log('✅ SUCCESS: Related article was successfully added!');
              } else {
                console.log('❌ FAILED: Related article was not found in the updated article');
              }
            } else {
              console.log('❌ FAILED: No related articles found after update');
            }
          } else {
            console.log('❌ FAILED: Could not verify update:', verifyData.message);
          }
        } else {
          console.log('❌ FAILED: Could not update article:', updateResult.message);
        }
      } else {
        console.log('Not enough articles to test related articles functionality');
      }
      
    } else {
      console.log('No articles found or API error:', articlesData.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testRelatedArticles();
