#!/usr/bin/env python3
import requests
import json
import sys

BASE_URL = "http://localhost:3001/api/v1"

# Login
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "admin@terraindustries.co", "password": "admin123"}
)
token = login_response.json()["data"]["token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# Get category and tag IDs
categories = requests.get(f"{BASE_URL}/categories").json()["data"]
tags = requests.get(f"{BASE_URL}/tags").json()["data"]

category_map = {cat["slug"]: cat["id"] for cat in categories}
tag_map = {tag["slug"]: tag["id"] for tag in tags}

# Posts to create
posts = [
    {
        "title": "Terrahaptix Protects Over $13 Billion in Critical Infrastructure Across Africa",
        "slug": "terrahaptix-protects-13-billion-critical-infrastructure-africa",
        "excerpt": "Terrahaptix announces a major milestone: their autonomous defense systems now protect over $13 billion worth of critical infrastructure across Africa.",
        "content": """Terrahaptix has reached a historic milestone: our autonomous defense systems now protect over $13 billion worth of critical infrastructure across Africa. This achievement demonstrates our significant market penetration and underscores our role in safeguarding the global economy while accelerating industrialization efforts across the continent.

## The Scale of Protection

Our systems are actively protecting critical assets across multiple African countries, including:

- **Oil Pipelines**: Securing energy infrastructure essential for economic stability
- **Mining Operations**: Protecting valuable mineral resources and extraction facilities
- **Power Plants**: Securing hydroelectric and thermal power generation facilities
- **Refineries**: Protecting energy processing and distribution infrastructure
- **Other Critical Assets**: Comprehensive protection across various infrastructure types

## Economic Impact

This milestone represents more than just numbers—it's about safeguarding the global economy. Africa's critical infrastructure is essential for:

- **Global Supply Chains**: Ensuring uninterrupted resource extraction and processing
- **Economic Stability**: Protecting assets that drive national and regional economies
- **Industrialization**: Enabling Africa's transformation into an industrial powerhouse
- **Energy Security**: Securing power generation and distribution networks

## Five-Year Vision

This achievement is just the beginning. Our five-year goal is to protect up to $1 trillion in critical assets across emerging markets, positioning Terrahaptix as the leading provider of autonomous defense systems for critical infrastructure protection.

## Technology at Scale

Protecting $13 billion in infrastructure requires:

- **Advanced AI Systems**: Real-time threat detection and autonomous response
- **Scalable Deployment**: Systems that can be rapidly deployed across diverse environments
- **Reliable Operations**: 24/7 monitoring and protection capabilities
- **Integrated Solutions**: Seamless integration with existing security infrastructure

This milestone validates our technology, our approach, and our mission to protect Africa's critical infrastructure with world-class autonomous systems.""",
        "category": "product-showcases",
        "tags": ["critical-infrastructure"]
    },
    {
        "title": "Terrahaptix Unveils Africa's Largest Drone Factory in Abuja",
        "slug": "terrahaptix-unveils-africas-largest-drone-factory-abuja",
        "excerpt": "Terrahaptix announces the launch of their upgraded drone manufacturing facility in Abuja, establishing the largest drone factory on the African continent.",
        "content": """Terrahaptix has achieved a significant milestone with the unveiling of our upgraded drone manufacturing facility in Abuja, Nigeria. This achievement, completed in just 11 months from conceptualization to realization, establishes the largest drone factory on the African continent and represents a cornerstone of our ambitious three-year plan to construct a network of drone factories across Africa.

## Manufacturing Excellence

Our upgraded facility features:

- **Production Capacity**: 20 Iroko drones per day, enabling rapid scaling of operations
- **Local Manufacturing**: 80% of components manufactured or sourced within Nigeria
- **Quality Standards**: Aerospace-grade manufacturing processes and quality control
- **Scalable Operations**: Infrastructure designed for future expansion and increased capacity

## Made in Africa Advantage

This facility embodies our "Made in Africa" positioning, providing several strategic advantages:

- **Local Sourcing**: 80% component localization reduces dependency on international supply chains
- **Economic Impact**: Job creation and local economic development in Abuja and surrounding regions
- **Competitive Advantage**: Cost-effective production through local sourcing and manufacturing
- **Technology Sovereignty**: Building Africa's capacity to produce world-class autonomous systems

## Three-Year Expansion Plan

The Abuja facility is the first in our three-year plan to construct a network of drone factories across Africa. This expansion strategy will:

- **Increase Production Capacity**: Meet growing demand for autonomous defense systems
- **Reduce Costs**: Local manufacturing reduces shipping and import costs
- **Create Jobs**: Generate employment opportunities across multiple African countries
- **Strengthen Supply Chains**: Build resilient, continent-wide manufacturing networks

## Infrastructure Protection Impact

With increased production capacity, we can now:

- **Deploy Faster**: Rapid deployment of defense systems to protect critical infrastructure
- **Scale Operations**: Meet the growing demand for infrastructure protection across Africa
- **Reduce Costs**: More affordable solutions through local manufacturing
- **Enhance Reliability**: Shorter supply chains mean faster maintenance and support

This factory represents more than manufacturing—it's a statement of African capability, innovation, and determination to protect our continent's critical infrastructure with world-class technology made right here in Africa.""",
        "category": "product-showcases",
        "tags": ["autonomous-systems"]
    },
    {
        "title": "Terrahaptix Secures $1.2 Million Contract for Hydroelectric Plant Protection",
        "slug": "terrahaptix-secures-1-2-million-hydroelectric-plant-protection-contract",
        "excerpt": "Terrahaptix announces their largest contract to date, valued at $1.2 million, to protect two major hydroelectric power plants in Nigeria.",
        "content": """Terrahaptix has secured our largest contract to date, valued at $1.2 million, to protect two major hydroelectric power plants in Nigeria. This contract, awarded by Nethawk Solutions, involves deploying a large fleet of drones and solar-powered sentry towers for real-time threat detection and response, marking a significant milestone in our growth and market penetration.

## Contract Scope

This comprehensive security solution includes:

- **Large Drone Fleet**: Multiple autonomous drones for continuous monitoring and threat response
- **Sentry Towers**: Solar-powered surveillance towers for persistent perimeter monitoring
- **ArtemisOS Integration**: All systems integrated through our proprietary Artemis operating system
- **Real-Time Protection**: 24/7 threat detection and autonomous response capabilities

## Technology Deployment

The contract leverages our complete technology stack:

- **AI-Powered Drones**: Autonomous threat detection and response systems
- **Solar-Powered Sentry Towers**: Persistent monitoring without grid dependency
- **ArtemisOS Platform**: Centralized command and control for all systems
- **Integrated Operations**: Seamless coordination between aerial and ground-based systems

## Revenue Model Innovation

This contract establishes a recurring revenue model through annual software subscriptions for ArtemisOS, demonstrating:

- **Sustainable Business Model**: Long-term revenue streams beyond initial hardware sales
- **Customer Value**: Ongoing software updates and system improvements
- **Market Validation**: Recognition of software capabilities and value proposition
- **Scalability**: Model that can be replicated across multiple contracts

## Market Impact

This contract represents:

- **Market Validation**: Significant credibility and positioning in the infrastructure security market
- **Technology Proof**: Demonstration of our ability to protect critical energy infrastructure
- **Growth Milestone**: Largest contract to date, indicating strong market demand
- **Strategic Positioning**: Enhanced reputation for protecting high-value critical assets

## Infrastructure Security Impact

Protecting hydroelectric power plants is critical because:

- **Energy Security**: Power plants are essential for national energy infrastructure
- **Economic Stability**: Uninterrupted power generation supports economic activities
- **National Security**: Energy infrastructure is a strategic national asset
- **Public Safety**: Reliable power supply is essential for public services and safety

This contract demonstrates Terrahaptix's capability to protect some of Africa's most critical infrastructure assets with world-class autonomous defense systems.""",
        "category": "product-showcases",
        "tags": ["critical-infrastructure"]
    },
    {
        "title": "ArtemisOS: The AI-Powered Operating System Powering Africa's Infrastructure Protection",
        "slug": "artemisos-ai-powered-operating-system-infrastructure-protection",
        "excerpt": "Discover ArtemisOS, Terrahaptix's open operating system that brings data intelligence and autonomy to infrastructure security.",
        "content": """ArtemisOS is Terrahaptix's strategic advantage—an AI-powered, open operating system that brings data intelligence and autonomy to infrastructure security. Designed to be sensor, network, and system agnostic, ArtemisOS collects, analyzes, and protects sensitive surveillance data while enabling autonomous operations across all our defense systems.

## Core Capabilities

### Autonomous Mission Planning

ArtemisOS performs advanced decision-making capabilities, including:

- **Path Planning**: Intelligent route optimization for autonomous vehicles
- **Obstacle Avoidance**: Real-time navigation around obstacles and hazards
- **Mission Optimization**: Dynamic mission planning based on real-time conditions
- **Resource Management**: Efficient allocation of system resources

### Geolocation & Data Analysis

ArtemisOS collects, analyzes, and interprets large volumes of drone data:

- **Real-Time Processing**: Instant analysis of surveillance data
- **Pattern Recognition**: AI-powered identification of threat patterns
- **Data Fusion**: Integration of data from multiple sensors and sources
- **Intelligence Generation**: Actionable insights from raw surveillance data

### Drone Fleet Management

Facilitating and coordinating swarms of unmanned systems:

- **Cluster Management**: Coordination of multiple drones in a single mission
- **Fleet Coordination**: Seamless operation of large drone fleets
- **Resource Allocation**: Optimal distribution of tasks across available systems
- **Scalable Operations**: Management of fleets from single units to hundreds of drones

### AI Detection and Tracking

ArtemisOS uses advanced AI to detect, identify, and track chosen targets:

- **Target Detection**: AI-powered identification of threats and objects of interest
- **Classification**: Automatic categorization of detected objects
- **Tracking**: Continuous monitoring and tracking of identified targets
- **Threat Assessment**: Real-time evaluation of potential threats

## Strategic Components

### Artemis Cloud

Artemis Cloud helps operators store and analyze surveillance data in real-time:

- **Data Storage**: Secure cloud-based storage for surveillance data
- **Real-Time Analysis**: Instant processing and analysis of incoming data
- **Scalable Infrastructure**: Cloud-based architecture that scales with operations
- **Data Intelligence**: Advanced analytics and reporting capabilities

### Artemis Autonomy

Artemis Autonomy enables command & control capabilities:

- **Remote Control**: Full remote operation capabilities
- **Autonomous Operations**: AI-driven autonomous decision-making
- **Mission Management**: Complete mission planning and execution control
- **System Integration**: Seamless integration with all Terrahaptix systems

## Real-World Applications

ArtemisOS is currently protecting:

- **Power Plants**: Four power plants and multiple substations under active protection
- **Hydroelectric Facilities**: Major hydroelectric plants with integrated drone and sentry tower systems
- **Critical Infrastructure**: Over $13 billion in infrastructure assets across Africa

## Technical Advantages

- **Open Architecture**: Sensor, network, and system agnostic design
- **Scalability**: From single systems to large-scale deployments
- **Integration**: Seamless integration with existing security infrastructure
- **Autonomy**: Advanced AI capabilities for autonomous operations
- **Intelligence**: Real-time data analysis and threat detection

ArtemisOS represents the future of infrastructure security—an intelligent, autonomous operating system that brings world-class protection to Africa's critical assets.""",
        "category": "technology-innovation",
        "tags": ["ai-machine-learning"]
    }
]

# Create posts
for post_data in posts:
    category_id = category_map.get(post_data["category"])
    tag_ids = [tag_map.get(tag) for tag in post_data["tags"] if tag_map.get(tag)]
    
    payload = {
        "title": post_data["title"],
        "slug": post_data["slug"],
        "excerpt": post_data["excerpt"],
        "content": post_data["content"],
        "status": "PUBLISHED",
        "categoryIds": [category_id] if category_id else [],
        "tagIds": tag_ids
    }
    
    response = requests.post(f"{BASE_URL}/posts", headers=headers, json=payload)
    if response.status_code == 201:
        print(f"✅ Created: {post_data['title']}")
    else:
        print(f"❌ Failed: {post_data['title']}")
        print(f"   Error: {response.text}")

print("\n🎉 Enhanced content creation complete!")
