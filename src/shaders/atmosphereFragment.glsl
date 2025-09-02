varying vec3 vertexNormal;

void main() {
    // Adjust these values for control:
    float falloff = 0.7;       // Higher = smaller atmosphere
    float smoothness = 3.0;    // Higher = smoother fade
    vec3 color = vec3(0.3, 0.6, 0.9);
    float alphaMultiplier = 0.8; // Controls overall opacity
    
    // Calculate intensity with smoother falloff
    float intensity = pow(falloff - dot(vertexNormal, vec3(0,0,1.0)), smoothness);
    
    // Apply smoothstep for even smoother edges
    intensity = smoothstep(0.0, 1.0, intensity);
    
    float alpha = intensity * alphaMultiplier;
    
    gl_FragColor = vec4(color, alpha);
}