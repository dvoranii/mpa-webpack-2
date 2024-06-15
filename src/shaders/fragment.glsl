uniform sampler2D globeTexture;
varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0, 0, 1));
    vec3 atmosphereColor = vec3(0.3, 0.6, 1.0); 
    float atmosphereBrightness = 1.5;
    vec3 atmosphere = atmosphereColor * pow(intensity, atmosphereBrightness);

    vec4 globeColor = texture2D(globeTexture, vertexUV);
    
   gl_FragColor = vec4(atmosphere + globeColor.xyz, 1.0);
}