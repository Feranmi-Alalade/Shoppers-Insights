# import json
# import pandas as pd
# from db import SessionLocal
# from crud import get_recommendations
# from dash import Dash, dcc, html, Input, Output
# import dash_bootstrap_components as dbc
# from fastapi import FastAPI, HTTPException
# import plotly.express as px
# import plotly.graph_objects as go
# from crud import get_all_receipts
# from schemas.dataclasses import ReceiptExtraction

# # Define theme and style
# THEME = dbc.themes.FLATLY
# ICONS = dbc.icons.BOOTSTRAP
# BACKGROUND_COLOR = "#60199a"

# def get_data():
#     """Fetch data from DB and clean it."""
#     db = SessionLocal()
#     try:
#         # get all receipts from the db
#         receipts_orm = get_all_receipts(db) 
        
#         if not receipts_orm:
#              return pd.DataFrame(columns=['status', 'total', 'date', 'categories', 'store'])

#         # convert receipts to dictionary
#         receipts_data = [
#             {
#                 "id": r.id,
#                 "store": r.store,
#                 "total": r.total,
#                 "date": r.date,
#                 "status": r.status,
#                 "categories": r.categories,
#                 "itemsList": r.itemsList
#             }
#             for r in receipts_orm
#         ]

#         # Create DataFrame
#         df = pd.DataFrame(receipts_data)
        
#         # 4. Clean Data
#         df['date'] = pd.to_datetime(df['date'])
        
#         df['categories'] = df['categories'].apply(lambda x: json.loads(x) if isinstance(x, str) else (x if x else []))
        
#         df = df.explode('categories') # returns multiple versions for each row but with different values of categories in the list
#         df['category_name'] = df['categories'].apply(lambda x: x.get('name') if isinstance(x, dict) else 'Uncategorized') # recovers the name of the category
#         df['category_amount'] = df['categories'].apply(lambda x: x.get('amount') if isinstance(x, dict) else 0.0) # recovers the corresponding amount

#         df['category_amount'] = pd.to_numeric(df['category_amount'], errors='coerce').fillna(0.0) # converts the amount to numeric

#         df = df[~df['category_name'].isin(['Other', 'Others'])] # removes the infinitessimal amounts e.g <1 dollar
        
#         return df
    
#     except Exception as e:
#         print(f"Error returned: {e}")
#         # Return empty structure to prevent crashes
#         return pd.DataFrame(columns=['status', 'total', 'date', 'categories', 'store'])
    
#     finally:
#         db.close()

# def create_dash_app(server: FastAPI):
#     """
#     Creates the Dash app with a Bootstrap theme (PowerBI style).

#     Two filters: Category and Status
#     """
    
#     # Initialize Dash with the theme defined above
#     dash_app = Dash(
#         __name__, 
#         server=True,
#         requests_pathname_prefix='/dashboard/',
#         routes_pathname_prefix='/',
#         external_stylesheets=[THEME, ICONS]
#     )

#     # Load initial data for the dropdown
#     initial_df = get_data()

#     # Navigation Bar
#     navbar = dbc.NavbarSimple(
#         brand="Shopper Insights Dashboard",
#         brand_href="#",
#         color="primary",
#         dark=True,
#         className="mb-4 shadow-sm"
#     )

#     # Filter Card with TWO Dropdowns
#     filter_card = dbc.Card([
#         dbc.CardBody([
#             dbc.Row([
#                 dbc.Col([
#                     html.Label("Filter by Status", className="fw-bold text-muted"),
#                     dcc.Dropdown(
#                         id='status-dropdown',
#                         options=[{'label': i, 'value': i} for i in initial_df['status'].unique()] if not initial_df.empty else [],
#                         value=None,
#                         placeholder="Select Status",
#                         className="mb-0",
#                         clearable=True
#                     )
#                 ], width=12, md=6, className="mb-3 mb-md-0"),

#                 # Category
#                 dbc.Col([
#                     html.Label("Filter by Category", className="fw-bold text-muted"),
#                     dcc.Dropdown(
#                         id='category-dropdown',
#                         options=[{'label': str(i), 'value': i} for i in initial_df['category_name'].unique()] if not initial_df.empty else [],
#                         value=None,
#                         placeholder="Select Category",
#                         className="mb-0",
#                         clearable=True
#                     )
#                 ], width=12, md=6)
#             ])
#         ])
#     ], className="shadow-sm mb-4 border-0")

#     ai_trigger_card = dbc.Card([
#         dbc.CardBody([
#             html.H4("AI Health Coach", className="card-title text-primary"),
#             html.P("Generate a personalized health & spending report based on your receipt history.", className="card-text text-muted"),
#             dbc.Button("Generate Health Analysis", id="btn-generate-ai", color="primary", className="w-100"),
#         ])
#     ], className="shadow-sm border-0 h-100")

#     dash_app.layout = html.Div([
#         navbar,
        
#         dbc.Container([
            
#             # KPI Cards (Big Numbers)
#             dbc.Row([
#                 dbc.Col([
#                     dbc.Card([
#                         dbc.CardBody([
#                             html.H6("Total Expenditure", className="card-subtitle text-muted mb-2"),
#                             html.H2(id="kpi-total-spent", className="card-title text-primary")
#                         ])
#                     ], className="shadow-sm mb-4 border-0 border-start border-primary border-5")
#                 ], width=6, md=6),
                
#                 dbc.Col([
#                     dbc.Card([
#                         dbc.CardBody([
#                             html.H6("Total Transactions", className="card-subtitle text-muted mb-2"),
#                             html.H2(id="kpi-total-tx", className="card-title text-success")
#                         ])
#                     ], className="shadow-sm mb-4 border-0 border-start border-success border-5")
#                 ], width=6, md=6),
#             ]),

#             # Filter
#             dbc.Row([
#                 dbc.Col(filter_card, width=12)
#             ]),

#             # Charts
#             dbc.Row([
#                 # Pie Chart
#                 dbc.Col([
#                     dbc.Card([
#                         dbc.CardHeader("Spending Share by Category", className="bg-white fw-bold"),
#                         dbc.CardBody(dcc.Graph(id='category-pie', config={'displayModeBar': False}))
#                     ], className="shadow-sm h-100 border-0")
#                 ], width=12, lg=6, className="mb-4"),
                
#                 # Bar Chart
#                 dbc.Col([
#                     dbc.Card([
#                         dbc.CardHeader("Total Amount per Category", className="bg-white fw-bold"),
#                         dbc.CardBody(dcc.Graph(id='category-bar', config={'displayModeBar': False}))
#                     ], className="shadow-sm h-100 border-0")
#                 ], width=12, lg=6, className="mb-4"),
#             ]),

#             # Timeline (Scatter)
#             dbc.Row([
#                 dbc.Col([
#                     dbc.Card([
#                         dbc.CardHeader("Spending Timeline", className="bg-white fw-bold"),
#                         dbc.CardBody(dcc.Graph(id='time-series', config={'displayModeBar': False}))
#                     ], className="shadow-sm border-0")
#                 ], width=12, className="mb-5")
#             ]),

#             html.Hr(),
#             html.H3("AI Health Insights", className="mb-3 text-muted"),
            
#             dbc.Row([
#                 # Trigger Button
#                 dbc.Col(ai_trigger_card, width=12, lg=3, className="mb-4"),
                
#                 # Results Display (Hidden initially, shown after loading)
#                 dbc.Col([
#                     dcc.Loading(id="loading-ai", type="cube", color="#18bc9c", children=[
#                         html.Div(id="ai-results-container", style={'display': 'none'}, children=[
#                             dbc.Row([
#                                 # Health Score Gauge
#                                 dbc.Col([
#                                     dbc.Card([
#                                         dbc.CardHeader("Wellness Score"),
#                                         dbc.CardBody(dcc.Graph(id="ai-score-gauge", style={'height': '250px'}))
#                                     ], className="shadow-sm border-0 h-100")
#                                 ], width=12, lg=4, className="mb-3"),

#                                 # Text Analysis
#                                 dbc.Col([
#                                     dbc.Card([
#                                         dbc.CardHeader("Dietary & Financial Analysis"),
#                                         dbc.CardBody([
#                                             html.H6("🥗 Dietary Habits", className="fw-bold text-success"),
#                                             dcc.Markdown(id="ai-diet-text", className="small"),
#                                             html.Hr(),
#                                             html.H6("💸 Spending Impact", className="fw-bold text-warning"),
#                                             dcc.Markdown(id="ai-spend-text", className="small"),
#                                         ], style={'height': '250px', 'overflowY': 'auto'})
#                                     ], className="shadow-sm border-0 h-100")
#                                 ], width=12, lg=8, className="mb-3"),
#                             ]),

#                             # Recommendations Row
#                             dbc.Row([
#                                 dbc.Col([
#                                     dbc.Card([
#                                         dbc.CardHeader("Top Recommendations"),
#                                         dbc.CardBody(html.Div(id="ai-recommendations-list"))
#                                     ], className="shadow-sm border-0")
#                                 ], width=12)
#                             ])
#                         ])
#                     ])
#                 ], width=12, lg=9)
#             ], className="mb-5")
            
#         ], fluid=True, style={'maxWidth': '1400px'})
        
#     ], style={'backgroundColor': '#f4f6f8', 'minHeight': '100vh'}) # Light grey background


#     @dash_app.callback(
#         [Output('category-pie', 'figure'),
#          Output('category-bar', 'figure'),
#          Output('time-series', 'figure'),
#          Output('kpi-total-spent', 'children'),
#          Output('kpi-total-tx', 'children')],
#         [Input('status-dropdown', 'value'),
#          Input('category-dropdown', 'value')]
#     )
#     def update_graphs(selected_status, selected_category):
#         # Load fresh data every interaction
#         df = get_data()
        
#         # Default outputs if DB is empty
#         if df.empty:
#             empty_fig = px.scatter(title="No Data Available")
#             empty_fig.update_layout(template="plotly_white")
#             return empty_fig, empty_fig, empty_fig, "$0.00", "0"

#         filtered_df = df.copy()

#         if selected_status:
#             filtered_df = filtered_df[filtered_df['status'] == selected_status]
        
#         if selected_category:
#             # Filter by the clean name
#             filtered_df = filtered_df[filtered_df['category_name'] == selected_category]

#         # KPI Calculations
#         total_spent = filtered_df['category_amount'].sum()
#         count_tx = filtered_df['id'].nunique() if 'id' in filtered_df.columns else len(filtered_df)
        
#         kpi_spent_str = f"${total_spent:,.2f}"
#         kpi_count_str = f"{count_tx}"
        
#         # Pie Chart
#         fig_pie = px.pie(
#             filtered_df, values='category_amount', names='category_name', 
#             hole=0.4,
#             labels={'category_name': 'Category', 'category_amount': 'Spent ($)'},
#             color_discrete_sequence=px.colors.qualitative.Pastel
#         )
#         fig_pie.update_layout(template='plotly_white', margin=dict(l=20, r=20, t=20, b=20))

#         # Bar Chart
#         cat_group = filtered_df.groupby('category_name')['category_amount'].sum().reset_index().sort_values('category_amount', ascending=False)
#         fig_bar = px.bar(
#             cat_group, x='category_name', y='category_amount', color='category_name',
#             text_auto='.2s',
#             labels={'category_name': 'Product Category', 'category_amount': 'Total Amount ($)'},
#             color_discrete_sequence=px.colors.qualitative.Pastel
#         )
#         fig_bar.update_layout(template='plotly_white', showlegend=False, margin=dict(l=20, r=20, t=20, b=20))

#         # Timeline
#         fig_line = px.scatter(
#             filtered_df, x='date', y='category_amount', 
#             color='category_name', size='total', 
#             hover_data=['store'],
#             labels={'date': 'Date of Purchase', 'category_amount': 'Amount Spent ($)', 'category_name': 'Type'},
#             color_discrete_sequence=px.colors.qualitative.Pastel
#         )
#         fig_line.update_layout(template='plotly_white', margin=dict(l=20, r=20, t=20, b=20))

#         return fig_pie, fig_bar, fig_line, kpi_spent_str, kpi_count_str

#     @dash_app.callback(
#         [Output("ai-score-gauge", "figure"),
#          Output("ai-diet-text", "children"),
#          Output("ai-spend-text", "children"),
#          Output("ai-recommendations-list", "children"),
#          Output("ai-results-container", "style")],
#         [Input("btn-generate-ai", "n_clicks")],
#         prevent_initial_call=True
#     )
#     def update_ai_insights(n_clicks):
#         """
#         Updates the AI insights based on clicks.
#         It extracts the health score and others
#         from the response generated by the LLM
#         in the get_recommendation function
#         """
#         if not n_clicks:
#             return {}, "", "", "", {'display': 'none'}

#         # Creating DB Session and Calling AI
#         db = SessionLocal()
#         try:
#             # Calling the recommendation engine to retrieve the response from the LLM
#             report = get_recommendations(db)

#             score = report.health_score
#             diet_text = report.dietary_analysis 
#             spend_text = report.spending_patterns
#             recs = report.recommendations

#         except Exception as e:
#             print("Error generating insights")
#             score = 0
#             diet_text = "Error generating insights"
#             spend_text = "Error generating insights"
#             recs = ["Error generating insights"]

#         finally:
#             db.close()

        
#         gauge_fig = go.Figure(go.Indicator(
#             mode = "gauge+number",
#             value = score,
#             domain = {'x': [0, 1], 'y': [0, 1]},
#             title = {'text': "Health Score"},
#             gauge = {
#                 'axis': {'range': [None, 100]},
#                 'bar': {'color': "#18bc9c" if score > 70 else "#f39c12" if score > 50 else "#e74c3c"},
#                 'steps' : [
#                     {'range': [0, 50], 'color': "#fce4ec"},
#                     {'range': [50, 80], 'color': "#fff3e0"},
#                     {'range': [80, 100], 'color': "#e8f5e9"}
#                 ],
#             }
#         ))
#         gauge_fig.update_layout(margin=dict(l=20, r=20, t=20, b=20), height=250)

#         # Putting all recommendations into a list
        
#         rec_list = dbc.ListGroup([
#             dbc.ListGroupItem([
#                 html.Div([
#                     html.I(className="bi bi-check-circle-fill text-success me-2"),
#                     html.Span(rec)
#                 ], className="d-flex align-items-center")
#             ]) for rec in recs
#         ], flush=True)

#         return (
#             gauge_fig,
#             diet_text, 
#             spend_text, 
#             rec_list,
#             {'display': 'block'} # Showing the container
#         )
    
#     return dash_app


import json
import requests
import pandas as pd
from dash import Dash, dcc, html, Input, Output
import dash_bootstrap_components as dbc
import plotly.express as px
import plotly.graph_objects as go

API_BASE_URL = "http://127.0.0.1:8000/api/v1"

# Define theme and style
THEME = dbc.themes.FLATLY
ICONS = dbc.icons.BOOTSTRAP
BACKGROUND_COLOR = "#60199a"

def get_data():
    """Fetch data from API endpoint"""
    try:
        print(f"Fetching data from: {API_BASE_URL}/receipts/")
        response = requests.get(f"{API_BASE_URL}/receipts/")

        if response.status_code != 200:
            print(f"API Error: {response.status_code}")
            return pd.DataFrame()
        
        data = response.json()

        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Convert None/NaN to empty list so the loop doesn't crash
        df['categories'] = df['categories'].apply(lambda x: x if isinstance(x, list) else [])

        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        
        # Explode Categories
        df = df.explode('categories') 
        
        # Extraction
        def extract_name(x):
            if isinstance(x, dict):
                return x.get('name', 'Uncategorized')
            return 'Uncategorized'

        def extract_amount(x):
            if isinstance(x, dict):
                return x.get('amount', 0.0)
            return 0.0

        df['category_name'] = df['categories'].apply(extract_name)
        df['category_amount'] = df['categories'].apply(extract_amount)
        
        # Conversion for Filtering
        df['category_amount'] = pd.to_numeric(df['category_amount'], errors='coerce').fillna(0.0)
        
        if 'status' in df.columns:
            df['status'] = df['status'].astype(str)
            
        # Filter out specific ignored categories
        df = df[~df['category_name'].isin(['Other', 'Others'])]

        return df
    
    except requests.exceptions.ConnectionError:
        print(f"Connection Error: Cannot connect to {API_BASE_URL}")
        return pd.DataFrame()

    except Exception as e:
        print(f"ERROR in get_data: {e}")
        return pd.DataFrame()
    

def create_dash_app():
    """
    Creates the Dash app with a Bootstrap theme (PowerBI style).

    Two filters: Category and Status
    """
    
    # Initialize Dash with the theme defined above
    dash_app = Dash(
        __name__, 
        server=True,
        requests_pathname_prefix='/dashboard/',
        routes_pathname_prefix='/',
        external_stylesheets=[THEME, ICONS]
    )

    # Load initial data for the dropdown
    # initial_df = get_data()

    # Navigation Bar
    navbar = dbc.NavbarSimple(
        brand="Shopper Insights Dashboard",
        brand_href="#",
        color="primary",
        dark=True,
        className="mb-4 shadow-sm"
    )

    # Filter Card with TWO Dropdowns
    filter_card = dbc.Card([
        dbc.CardBody([
            dbc.Row([
                dbc.Col([
                    html.Label("Filter by Status", className="fw-bold text-muted"),
                    dcc.Dropdown(
                        id='status-dropdown',
                        options=[],
                        value=None,
                        placeholder="Select Status",
                        className="mb-0",
                        clearable=True
                    )
                ], width=12, md=6, className="mb-3 mb-md-0"),

                # Category
                dbc.Col([
                    html.Label("Filter by Category", className="fw-bold text-muted"),
                    dcc.Dropdown(
                        id='category-dropdown',
                        options=[],
                        value=None,
                        placeholder="Select Category",
                        className="mb-0",
                        clearable=True
                    )
                ], width=12, md=6)
            ])
        ])
    ], className="shadow-sm mb-4 border-0")

    ai_trigger_card = dbc.Card([
        dbc.CardBody([
            html.H4("AI Health Coach", className="card-title text-primary"),
            html.P("Generate a personalized health & spending report based on your receipt history.", className="card-text text-muted"),
            dbc.Button("Generate Health Analysis", id="btn-generate-ai", color="primary", className="w-100"),
        ])
    ], className="shadow-sm border-0 h-100")

    dash_app.layout = html.Div([
        dcc.Location(id='url', refresh=False),

        navbar,
        
        dbc.Container([
            
            # KPI Cards (Big Numbers)
            dbc.Row([
                dbc.Col([
                    dbc.Card([
                        dbc.CardBody([
                            html.H6("Total Expenditure", className="card-subtitle text-muted mb-2"),
                            html.H2(id="kpi-total-spent", className="card-title text-primary")
                        ])
                    ], className="shadow-sm mb-4 border-0 border-start border-primary border-5")
                ], width=6, md=6),
                
                dbc.Col([
                    dbc.Card([
                        dbc.CardBody([
                            html.H6("Total Transactions", className="card-subtitle text-muted mb-2"),
                            html.H2(id="kpi-total-tx", className="card-title text-success")
                        ])
                    ], className="shadow-sm mb-4 border-0 border-start border-success border-5")
                ], width=6, md=6),
            ]),

            # Filter
            dbc.Row([
                dbc.Col(filter_card, width=12)
            ]),

            # Charts
            dbc.Row([
                # Pie Chart
                dbc.Col([
                    dbc.Card([
                        dbc.CardHeader("Spending Share by Category", className="bg-white fw-bold"),
                        dbc.CardBody(dcc.Graph(id='category-pie', config={'displayModeBar': False}))
                    ], className="shadow-sm h-100 border-0")
                ], width=12, lg=6, className="mb-4"),
                
                # Bar Chart
                dbc.Col([
                    dbc.Card([
                        dbc.CardHeader("Total Amount per Category", className="bg-white fw-bold"),
                        dbc.CardBody(dcc.Graph(id='category-bar', config={'displayModeBar': False}))
                    ], className="shadow-sm h-100 border-0")
                ], width=12, lg=6, className="mb-4"),
            ]),

            # Timeline (Scatter)
            dbc.Row([
                dbc.Col([
                    dbc.Card([
                        dbc.CardHeader("Spending Timeline", className="bg-white fw-bold"),
                        dbc.CardBody(dcc.Graph(id='time-series', config={'displayModeBar': False}))
                    ], className="shadow-sm border-0")
                ], width=12, className="mb-5")
            ]),

            html.Hr(),
            html.H3("AI Health Insights", className="mb-3 text-muted"),
            
            dbc.Row([
                # Trigger Button
                dbc.Col(ai_trigger_card, width=12, lg=3, className="mb-4"),
                
                # Results Display (Hidden initially, shown after loading)
                dbc.Col([
                    dcc.Loading(id="loading-ai", type="cube", color="#18bc9c", children=[
                        html.Div(id="ai-results-container", style={'display': 'none'}, children=[
                            dbc.Row([
                                # Health Score Gauge
                                dbc.Col([
                                    dbc.Card([
                                        dbc.CardHeader("Wellness Score"),
                                        dbc.CardBody(dcc.Graph(id="ai-score-gauge", style={'height': '250px'}))
                                    ], className="shadow-sm border-0 h-100")
                                ], width=12, lg=4, className="mb-3"),

                                # Text Analysis
                                dbc.Col([
                                    dbc.Card([
                                        dbc.CardHeader("Dietary & Financial Analysis"),
                                        dbc.CardBody([
                                            html.H6("🥗 Dietary Habits", className="fw-bold text-success"),
                                            dcc.Markdown(id="ai-diet-text", className="small"),
                                            html.Hr(),
                                            html.H6("💸 Spending Impact", className="fw-bold text-warning"),
                                            dcc.Markdown(id="ai-spend-text", className="small"),
                                        ], style={'height': '250px', 'overflowY': 'auto'})
                                    ], className="shadow-sm border-0 h-100")
                                ], width=12, lg=8, className="mb-3"),
                            ]),

                            # Recommendations Row
                            dbc.Row([
                                dbc.Col([
                                    dbc.Card([
                                        dbc.CardHeader("Top Recommendations"),
                                        dbc.CardBody(html.Div(id="ai-recommendations-list"))
                                    ], className="shadow-sm border-0")
                                ], width=12)
                            ])
                        ])
                    ])
                ], width=12, lg=9)
            ], className="mb-5")
            
        ], fluid=True, style={'maxWidth': '1400px'})
        
    ], style={'backgroundColor': '#f4f6f8', 'minHeight': '100vh'}) # Light grey background


    @dash_app.callback(
        [Output('status-dropdown', 'options'),
         Output('category-dropdown', 'options')],
        [Input('url', 'pathname')]
    )
    def populate_dropdowns(_):
        # This now runs ONLY when the user loads the page, so the server is UP.
        df = get_data()
        
        if df.empty:
            return [], []
            
        status_opts = [{'label': i, 'value': i} for i in sorted(df['status'].unique())]
        cat_opts = [{'label': str(i), 'value': i} for i in sorted(df['category_name'].unique())]
        
        return status_opts, cat_opts

    @dash_app.callback(
        [Output('category-pie', 'figure'),
         Output('category-bar', 'figure'),
         Output('time-series', 'figure'),
         Output('kpi-total-spent', 'children'),
         Output('kpi-total-tx', 'children')],
        [Input('status-dropdown', 'value'),
         Input('category-dropdown', 'value')]
    )
    def update_graphs(selected_status, selected_category):
        # Load fresh data every interaction
        df = get_data()
        
        # Default outputs if DB is empty
        if df.empty:
            empty_fig = px.scatter(title="No Data Available")
            empty_fig.update_layout(template="plotly_white")
            return empty_fig, empty_fig, empty_fig, "$0.00", "0"

        filtered_df = df.copy()

        if selected_status:
            filtered_df = filtered_df[filtered_df['status'] == selected_status]
        
        if selected_category:
            # Filter by the clean name
            filtered_df = filtered_df[filtered_df['category_name'] == selected_category]

        # KPI Calculations
        total_spent = filtered_df['category_amount'].sum()
        count_tx = filtered_df['id'].nunique() if 'id' in filtered_df.columns else len(filtered_df)
        
        kpi_spent_str = f"${total_spent:,.2f}"
        kpi_count_str = f"{count_tx}"
        
        # Pie Chart
        fig_pie = px.pie(
            filtered_df, values='category_amount', names='category_name', 
            hole=0.4,
            labels={'category_name': 'Category', 'category_amount': 'Spent ($)'},
            color_discrete_sequence=px.colors.qualitative.Pastel
        )
        fig_pie.update_layout(template='plotly_white', margin=dict(l=20, r=20, t=20, b=20))

        # Bar Chart
        cat_group = filtered_df.groupby('category_name')['category_amount'].sum().reset_index().sort_values('category_amount', ascending=False)
        fig_bar = px.bar(
            cat_group, x='category_name', y='category_amount', color='category_name',
            text_auto='.2s',
            labels={'category_name': 'Product Category', 'category_amount': 'Total Amount ($)'},
            color_discrete_sequence=px.colors.qualitative.Pastel
        )
        fig_bar.update_layout(template='plotly_white', showlegend=False, margin=dict(l=20, r=20, t=20, b=20))

        # Timeline
        fig_line = px.scatter(
            filtered_df, x='date', y='category_amount', 
            color='category_name', size='total', 
            hover_data=['store'],
            labels={'date': 'Date of Purchase', 'category_amount': 'Amount Spent ($)', 'category_name': 'Type'},
            color_discrete_sequence=px.colors.qualitative.Pastel
        )
        fig_line.update_layout(template='plotly_white', margin=dict(l=20, r=20, t=20, b=20))

        # Timeline
        # Check if store exists in data, if not don't use it in hover
        hover_data = ['store'] if 'store' in filtered_df.columns else None
        
        fig_line = px.scatter(
            filtered_df, x='date', y='category_amount', 
            color='category_name', size='total',
            hover_data=hover_data,
            color_discrete_sequence=px.colors.qualitative.Pastel
        )
        fig_line.update_layout(template='plotly_white', margin=dict(l=20, r=20, t=20, b=20))

        return fig_pie, fig_bar, fig_line, kpi_spent_str, kpi_count_str

    @dash_app.callback(
        [Output("ai-score-gauge", "figure"),
         Output("ai-diet-text", "children"),
         Output("ai-spend-text", "children"),
         Output("ai-recommendations-list", "children"),
         Output("ai-results-container", "style")],
        [Input("btn-generate-ai", "n_clicks")],
        prevent_initial_call=True
    )
    def update_ai_insights(n_clicks):
        """
        Updates the AI insights based on clicks.
        It extracts the health score and others
        from the response generated by the LLM
        in the get_recommendation function
        """
        if not n_clicks:
            return {}, "", "", "", {'display': 'none'}

        score = 0
        diet_text = "Unavailable"
        spend_text = "Unavailable"
        recs = []

        try:
            # CALLING THE API for Recommendations
            # Adjust URL if your endpoint is named differently, e.g. /api/v1/recommendations/
            response = requests.get(f"{API_BASE_URL}/recommendations/") 
            
            if response.status_code == 200:
                report = response.json() # Returns Dict, not Object
                
                # Access Dict keys now! (Not dot notation, because it's JSON from Requests)
                score = report.get('health_score', 0)
                diet_text = report.get('dietary_analysis', 'No Data')
                spend_text = report.get('spending_patterns', 'No Data')
                recs = report.get('recommendations', [])
            else:
                diet_text = f"API Error: {response.status_code}"

        except Exception as e:
            print(f"Error generating insights: {e}")
            diet_text = "Connection failed"

        
        gauge_fig = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = score,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "Health Score"},
            gauge = {
                'axis': {'range': [None, 100]},
                'bar': {'color': "#18bc9c" if score > 70 else "#f39c12" if score > 50 else "#e74c3c"},
                'steps' : [
                    {'range': [0, 50], 'color': "#fce4ec"},
                    {'range': [50, 80], 'color': "#fff3e0"},
                    {'range': [80, 100], 'color': "#e8f5e9"}
                ],
            }
        ))
        gauge_fig.update_layout(margin=dict(l=20, r=20, t=20, b=20), height=250)

        # Putting all recommendations into a list
        
        rec_list = dbc.ListGroup([
            dbc.ListGroupItem([
                html.Div([
                    html.I(className="bi bi-check-circle-fill text-success me-2"),
                    html.Span(rec)
                ], className="d-flex align-items-center")
            ]) for rec in recs
        ], flush=True)

        return (
            gauge_fig,
            diet_text, 
            spend_text, 
            rec_list,
            {'display': 'block'} # Showing the container
        )
    
    return dash_app