"""
Starter App for Final Project
Choose your style:
- Streamlit
- FastAPI
- CLI
"""

import streamlit as st

st.title("🚀 Generative AI Final Project")
st.write("Welcome! Start building your GenAI project here.")

# Example input/output UI
user_input = st.text_input("Ask me anything:")

if user_input:
    st.write(f"🤖 Your AI would respond here to: {user_input}")
