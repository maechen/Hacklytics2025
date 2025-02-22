import streamlit as st
import streamlit.components.v1 as components

# Set up the page
st.set_page_config(page_title="Football Analyzer", layout="wide")

# Custom CSS to remove grey background
st.markdown("""
    <style>
        /* Remove Streamlit's default background color */
        .stApp {
            background-color: white !important;
        }
        /* Remove padding and margins */
        .main {
            padding: 0px !important;
        }
        /* Ensure embedded components fit properly */
        iframe {
            border: none !important;
        }
    </style>
""", unsafe_allow_html=True)

st.title("Football Analyzer")

# Session state for toggling Watch Next visibility
if "show_watch_next" not in st.session_state:
    st.session_state.show_watch_next = True

# Create three columns: left (1), center (2), right (1)
col_left, col_center, col_right = st.columns([1, 2, 1])

# LEFT COLUMN: Watch Next section with toggle button
with col_left:
    if st.button("Hide Watch Next" if st.session_state.show_watch_next else "Show Watch Next"):
        st.session_state.show_watch_next = not st.session_state.show_watch_next
        st.experimental_rerun()
    
    if st.session_state.show_watch_next:
        with st.expander("Watch Next", expanded=True):
            st.markdown("### Video 1 Title")
            st.video("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            st.write("Description for Video 1: Brief info about this play.")
            
            st.markdown("### Video 2 Title")
            st.video("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            st.write("Description for Video 2: Brief info about this play.")
            
            st.markdown("### Video 3 Title")
            st.video("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            st.write("Description for Video 3: Brief info about this play.")
            
            st.markdown("### Video 4 Title")
            st.video("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            st.write("Description for Video 4: Brief info about this play.")

# CENTER COLUMN: Embedded YouTube video with proper width
with col_center:
    html_code = """
    <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
        <iframe width="100%" height="500" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Football Analysis Video" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
    </div>
    """
    components.html(html_code, height=520)

# RIGHT COLUMN: Chat Bot
with col_right:
    st.markdown("## Chat Bot")
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []
    
    for message in st.session_state.chat_history:
        st.write(message)
    
    user_input = st.text_input("Enter your message:")
    if st.button("Send"):
        if user_input:
            st.session_state.chat_history.append(f"User: {user_input}")
            st.session_state.chat_history.append(f"Bot: You said '{user_input}'")
            st.experimental_rerun()
