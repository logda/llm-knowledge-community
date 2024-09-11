-- mysql -u admin -p llm_knowledge_community < ./init.sql



DROP TABLE IF EXISTS documents;
-- 创建文档表
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    path VARCHAR(255) NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);


-- Insert sample documents
INSERT INTO documents (title, content, path) VALUES
('Introduction to AI', 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems.', '/demo'),
('Machine Learning Basics', 'Machine Learning is a subset of AI that focuses on the development of algorithms that can learn from and make predictions or decisions based on data.', '/demo'),
('Natural Language Processing', 'Natural Language Processing (NLP) is a branch of AI that deals with the interaction between computers and humans using natural language.', '/demo'),
('Deep Learning Overview', 'Deep Learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning.', '/demo'),
('Reinforcement Learning', 'Reinforcement Learning is an area of machine learning concerned with how software agents ought to take actions in an environment to maximize some notion of cumulative reward.', '/demo');