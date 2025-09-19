# Lesson 3: Embeddings and Vector Operations 🧮

## Learning Objectives
- Understand text embeddings and their applications
- Create and work with embedding vectors
- Implement similarity search
- Build semantic search systems
- Use embeddings for classification and clustering

---

## 1. Understanding Embeddings

### What Are Embeddings?

Embeddings are numerical representations of text that capture semantic meaning. They convert text into high-dimensional vectors where similar meanings are closer together.

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text, model="text-embedding-3-small"):
    """Convert text to embedding vector"""
    response = client.embeddings.create(
        input=text,
        model=model
    )
    return response.data[0].embedding

# Example
text = "Machine learning is fascinating"
embedding = get_embedding(text)
print(f"Embedding dimensions: {len(embedding)}")
print(f"First 10 values: {embedding[:10]}")
```

### Available Embedding Models

| Model | Dimensions | Use Case | Cost |
|-------|------------|----------|------|
| text-embedding-3-small | 1536 | Fast, cost-effective | $0.00002/1K tokens |
| text-embedding-3-large | 3072 | Higher accuracy | $0.00013/1K tokens |
| text-embedding-ada-002 | 1536 | Legacy, stable | $0.0001/1K tokens |

```python
def compare_embedding_models():
    """Compare different embedding models"""
    text = "Artificial intelligence is transforming the world"
    models = ["text-embedding-3-small", "text-embedding-3-large", "text-embedding-ada-002"]

    for model in models:
        embedding = get_embedding(text, model)
        print(f"{model}:")
        print(f"  Dimensions: {len(embedding)}")
        print(f"  Magnitude: {np.linalg.norm(embedding):.4f}")
        print(f"  Mean: {np.mean(embedding):.6f}\n")

compare_embedding_models()
```

---

## 2. Similarity Operations

### Cosine Similarity

```python
import numpy as np
from typing import List

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)

    dot_product = np.dot(vec1, vec2)
    magnitude1 = np.linalg.norm(vec1)
    magnitude2 = np.linalg.norm(vec2)

    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0

    return dot_product / (magnitude1 * magnitude2)

# Example usage
texts = [
    "I love programming in Python",
    "Python is my favorite programming language",
    "I enjoy cooking Italian food",
    "The weather is nice today"
]

embeddings = [get_embedding(text) for text in texts]

# Calculate similarities
print("Similarity Matrix:")
for i, text1 in enumerate(texts):
    similarities = []
    for j, text2 in enumerate(texts):
        sim = cosine_similarity(embeddings[i], embeddings[j])
        similarities.append(f"{sim:.3f}")
    print(f"{i}: {' '.join(similarities)}")
```

### Finding Similar Texts

```python
def find_most_similar(query: str, texts: List[str], top_k: int = 3):
    """Find most similar texts to a query"""
    # Get embeddings
    query_embedding = get_embedding(query)
    text_embeddings = [get_embedding(text) for text in texts]

    # Calculate similarities
    similarities = []
    for i, text_embedding in enumerate(text_embeddings):
        sim = cosine_similarity(query_embedding, text_embedding)
        similarities.append((sim, texts[i]))

    # Sort and return top k
    similarities.sort(reverse=True, key=lambda x: x[0])
    return similarities[:top_k]

# Example
documents = [
    "Python is a versatile programming language",
    "Machine learning requires mathematical knowledge",
    "Deep learning is a subset of machine learning",
    "Coffee is the best morning drink",
    "Neural networks are inspired by the brain"
]

query = "artificial intelligence and ML"
results = find_most_similar(query, documents)

print(f"Query: {query}\n")
for score, text in results:
    print(f"Similarity: {score:.3f} - {text}")
```

---

## 3. Building a Semantic Search System

### Simple Vector Database

```python
import json
import pickle
from typing import Dict, List, Tuple

class SimpleVectorDB:
    """Simple in-memory vector database"""

    def __init__(self):
        self.vectors: List[List[float]] = []
        self.metadata: List[Dict] = []

    def add(self, text: str, embedding: List[float], metadata: Dict = None):
        """Add item to database"""
        self.vectors.append(embedding)
        self.metadata.append(metadata or {"text": text})

    def search(self, query_embedding: List[float], top_k: int = 5) -> List[Tuple[float, Dict]]:
        """Search for similar items"""
        similarities = []
        for i, vector in enumerate(self.vectors):
            sim = cosine_similarity(query_embedding, vector)
            similarities.append((sim, self.metadata[i]))

        similarities.sort(reverse=True, key=lambda x: x[0])
        return similarities[:top_k]

    def save(self, filepath: str):
        """Save database to file"""
        with open(filepath, 'wb') as f:
            pickle.dump({"vectors": self.vectors, "metadata": self.metadata}, f)

    def load(self, filepath: str):
        """Load database from file"""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            self.vectors = data["vectors"]
            self.metadata = data["metadata"]

# Usage example
db = SimpleVectorDB()

# Add documents
documents = [
    {"text": "OpenAI creates AI models", "category": "AI"},
    {"text": "Python is great for data science", "category": "Programming"},
    {"text": "Machine learning transforms industries", "category": "AI"},
    {"text": "JavaScript runs in browsers", "category": "Programming"}
]

for doc in documents:
    embedding = get_embedding(doc["text"])
    db.add(doc["text"], embedding, doc)

# Search
query = "artificial intelligence applications"
query_embedding = get_embedding(query)
results = db.search(query_embedding, top_k=2)

print(f"Search query: {query}\n")
for score, metadata in results:
    print(f"Score: {score:.3f}")
    print(f"Text: {metadata['text']}")
    print(f"Category: {metadata['category']}\n")
```

### Advanced Semantic Search

```python
import pandas as pd
from datetime import datetime

class SemanticSearchEngine:
    """Production-ready semantic search"""

    def __init__(self, embedding_model="text-embedding-3-small"):
        self.client = OpenAI()
        self.embedding_model = embedding_model
        self.db = SimpleVectorDB()
        self.cache = {}

    def add_documents(self, documents: List[Dict]):
        """Batch add documents with progress tracking"""
        print(f"Adding {len(documents)} documents...")

        for i, doc in enumerate(documents):
            if i % 10 == 0:
                print(f"Progress: {i}/{len(documents)}")

            # Check cache
            text_hash = hash(doc["text"])
            if text_hash in self.cache:
                embedding = self.cache[text_hash]
            else:
                embedding = self._get_embedding(doc["text"])
                self.cache[text_hash] = embedding

            # Add metadata
            doc["added_at"] = datetime.now().isoformat()
            doc["doc_id"] = f"doc_{i}"

            self.db.add(doc["text"], embedding, doc)

        print("Documents added successfully!")

    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding with error handling"""
        try:
            response = self.client.embeddings.create(
                input=text,
                model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error getting embedding: {e}")
            return None

    def search(self, query: str, top_k: int = 5, filter_func=None):
        """Advanced search with filtering"""
        query_embedding = self._get_embedding(query)
        if not query_embedding:
            return []

        results = self.db.search(query_embedding, top_k=top_k*2)

        # Apply custom filter if provided
        if filter_func:
            results = [(score, meta) for score, meta in results if filter_func(meta)]

        return results[:top_k]

    def hybrid_search(self, query: str, keyword: str = None, top_k: int = 5):
        """Combine semantic and keyword search"""
        # Semantic search
        semantic_results = self.search(query, top_k=top_k*2)

        if keyword:
            # Filter by keyword
            filtered = []
            for score, meta in semantic_results:
                if keyword.lower() in meta["text"].lower():
                    # Boost score for keyword match
                    filtered.append((score * 1.2, meta))
                else:
                    filtered.append((score, meta))

            filtered.sort(reverse=True, key=lambda x: x[0])
            return filtered[:top_k]

        return semantic_results[:top_k]

# Example usage
search_engine = SemanticSearchEngine()

# Sample documents
docs = [
    {"text": "Introduction to machine learning algorithms", "type": "tutorial"},
    {"text": "Deep learning with PyTorch and TensorFlow", "type": "tutorial"},
    {"text": "Natural language processing fundamentals", "type": "course"},
    {"text": "Computer vision applications in healthcare", "type": "research"},
    {"text": "Reinforcement learning for robotics", "type": "research"}
]

search_engine.add_documents(docs)

# Different search types
print("Semantic Search:")
results = search_engine.search("neural networks", top_k=3)
for score, meta in results:
    print(f"  {score:.3f}: {meta['text']}")

print("\nFiltered Search (only tutorials):")
results = search_engine.search(
    "AI learning",
    filter_func=lambda x: x.get("type") == "tutorial"
)
for score, meta in results:
    print(f"  {score:.3f}: {meta['text']}")

print("\nHybrid Search:")
results = search_engine.hybrid_search("AI", keyword="learning")
for score, meta in results:
    print(f"  {score:.3f}: {meta['text']}")
```

---

## 4. Classification with Embeddings

### Zero-shot Classification

```python
def zero_shot_classify(text: str, categories: List[str]) -> str:
    """Classify text into categories using embeddings"""
    # Get embeddings
    text_embedding = get_embedding(text)
    category_embeddings = [get_embedding(cat) for cat in categories]

    # Find most similar category
    max_similarity = -1
    best_category = None

    for i, cat_embedding in enumerate(category_embeddings):
        similarity = cosine_similarity(text_embedding, cat_embedding)
        if similarity > max_similarity:
            max_similarity = similarity
            best_category = categories[i]

    return best_category, max_similarity

# Example
texts = [
    "The stock market crashed today",
    "Scientists discover new planet",
    "Team wins championship game",
    "New smartphone released"
]

categories = ["Business", "Science", "Sports", "Technology"]

print("Classification Results:")
for text in texts:
    category, confidence = zero_shot_classify(text, categories)
    print(f"Text: {text}")
    print(f"Category: {category} (confidence: {confidence:.3f})\n")
```

### Clustering with Embeddings

```python
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

def cluster_texts(texts: List[str], n_clusters: int = 3):
    """Cluster texts using embeddings"""
    # Get embeddings
    embeddings = [get_embedding(text) for text in texts]
    embeddings_array = np.array(embeddings)

    # Perform clustering
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    clusters = kmeans.fit_predict(embeddings_array)

    # Reduce dimensions for visualization
    pca = PCA(n_components=2)
    reduced_embeddings = pca.fit_transform(embeddings_array)

    # Plot results
    plt.figure(figsize=(10, 6))
    scatter = plt.scatter(
        reduced_embeddings[:, 0],
        reduced_embeddings[:, 1],
        c=clusters,
        cmap='viridis'
    )
    plt.colorbar(scatter)

    # Add labels
    for i, text in enumerate(texts):
        plt.annotate(
            text[:20] + "...",
            (reduced_embeddings[i, 0], reduced_embeddings[i, 1]),
            fontsize=8
        )

    plt.title(f"Text Clustering ({n_clusters} clusters)")
    plt.xlabel("PCA Component 1")
    plt.ylabel("PCA Component 2")
    plt.tight_layout()
    plt.savefig("clustering_result.png")

    # Return cluster assignments
    result = {}
    for i, cluster_id in enumerate(clusters):
        if cluster_id not in result:
            result[cluster_id] = []
        result[cluster_id].append(texts[i])

    return result

# Example
sample_texts = [
    "Python programming tutorial",
    "Machine learning with scikit-learn",
    "Deep learning fundamentals",
    "Cooking Italian pasta",
    "Best pizza recipes",
    "Mediterranean diet benefits",
    "Stock market analysis",
    "Investment strategies",
    "Financial planning tips"
]

clusters = cluster_texts(sample_texts, n_clusters=3)

print("Clustering Results:")
for cluster_id, texts in clusters.items():
    print(f"\nCluster {cluster_id}:")
    for text in texts:
        print(f"  - {text}")
```

---

## 5. Practical Applications

### Document Deduplication

```python
def find_duplicates(texts: List[str], threshold: float = 0.95):
    """Find near-duplicate texts using embeddings"""
    embeddings = [get_embedding(text) for text in texts]
    duplicates = []

    for i in range(len(texts)):
        for j in range(i + 1, len(texts)):
            similarity = cosine_similarity(embeddings[i], embeddings[j])
            if similarity > threshold:
                duplicates.append({
                    "text1": texts[i],
                    "text2": texts[j],
                    "similarity": similarity
                })

    return duplicates

# Example
documents = [
    "OpenAI develops artificial intelligence",
    "OpenAI creates AI technology",
    "Machine learning is a subset of AI",
    "Python is a programming language",
    "Python is a coding language"
]

duplicates = find_duplicates(documents, threshold=0.9)
print("Near-duplicate documents:")
for dup in duplicates:
    print(f"\nSimilarity: {dup['similarity']:.3f}")
    print(f"Text 1: {dup['text1']}")
    print(f"Text 2: {dup['text2']}")
```

### Question Answering System

```python
class QASystem:
    """Question answering using embeddings"""

    def __init__(self):
        self.client = OpenAI()
        self.knowledge_base = []

    def add_knowledge(self, question: str, answer: str):
        """Add Q&A pair to knowledge base"""
        embedding = get_embedding(question)
        self.knowledge_base.append({
            "question": question,
            "answer": answer,
            "embedding": embedding
        })

    def answer_question(self, query: str, threshold: float = 0.8):
        """Find answer to user query"""
        query_embedding = get_embedding(query)

        best_match = None
        best_score = 0

        for item in self.knowledge_base:
            similarity = cosine_similarity(query_embedding, item["embedding"])
            if similarity > best_score:
                best_score = similarity
                best_match = item

        if best_score > threshold:
            return best_match["answer"], best_score
        else:
            return "I don't have enough information to answer that question.", best_score

# Example usage
qa_system = QASystem()

# Add knowledge
qa_pairs = [
    ("What is machine learning?", "Machine learning is a subset of AI that enables systems to learn from data."),
    ("How does Python work?", "Python is an interpreted language that executes code line by line."),
    ("What are embeddings?", "Embeddings are numerical representations of text that capture semantic meaning.")
]

for q, a in qa_pairs:
    qa_system.add_knowledge(q, a)

# Test queries
test_queries = [
    "Explain machine learning",
    "How do embeddings work?",
    "What is quantum computing?"
]

print("Q&A System Results:")
for query in test_queries:
    answer, confidence = qa_system.answer_question(query)
    print(f"\nQ: {query}")
    print(f"A: {answer}")
    print(f"Confidence: {confidence:.3f}")
```

---

## 🧪 Practice Exercises

### Exercise 1: Semantic Search API
Build a REST API for semantic search:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class Document(BaseModel):
    text: str
    metadata: dict = {}

# Your implementation here
```

### Exercise 2: Multi-language Embeddings
Implement cross-language similarity:

```python
def cross_language_similarity(text_en: str, text_es: str):
    """
    Compare similarity between English and Spanish texts
    """
    # Your implementation here
    pass
```

### Exercise 3: Incremental Learning
Build a system that learns from user feedback:

```python
class AdaptiveSearchSystem:
    """
    Search system that improves based on clicks/feedback
    """
    # Your implementation here
    pass
```

---

## 📝 Assignment

Build a **Smart Document Search System** with:

1. **Features:**
   - Upload and index documents
   - Semantic search with highlighting
   - Similar document recommendations
   - Auto-categorization
   - Duplicate detection

2. **Advanced:**
   - Hybrid search (semantic + keyword)
   - Multi-language support
   - Query expansion
   - Relevance feedback

3. **UI:**
   - Streamlit interface
   - Upload documents
   - Search interface
   - Results with explanations

**Starter Code:**
```python
import streamlit as st
from typing import List, Dict
import hashlib

class DocumentSearchApp:
    def __init__(self):
        self.search_engine = SemanticSearchEngine()
        self.documents = []

    def upload_document(self, text: str, title: str):
        # Implementation here
        pass

    def search(self, query: str) -> List[Dict]:
        # Implementation here
        pass

    def find_similar(self, doc_id: str) -> List[Dict]:
        # Implementation here
        pass

def main():
    st.title("Smart Document Search")

    # Upload section
    st.header("Upload Documents")

    # Search section
    st.header("Search")

    # Results section
    # Implementation here

if __name__ == "__main__":
    main()
```

---

## ✅ Checklist

Before moving to Lesson 4, ensure you can:
- [ ] Create and work with embeddings
- [ ] Calculate similarity between texts
- [ ] Build semantic search systems
- [ ] Implement classification with embeddings
- [ ] Handle batch processing efficiently
- [ ] Optimize embedding operations for production

---

**Next**: [Lesson 4: Function Calling and Tools](./lesson-04-function-calling.md) →