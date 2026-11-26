// App Android da Caderneta de Gastos.
// Mostra os ficheiros da pasta docs/ (a mesma do site) dentro de um WebView,
// por isso qualquer alteração feita lá aparece também no APK.
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "mz.caderneta.gastos"
    compileSdk = 35

    defaultConfig {
        applicationId = "mz.caderneta.gastos"
        minSdk = 24
        targetSdk = 35
        versionCode = 9
        versionName = "1.3.5"
    }

    // Chave própria da Caderneta: assim cada nova versão instala por cima da anterior sem perder dados.
    signingConfigs {
        create("caderneta") {
            storeFile = rootProject.file("keystore/caderneta.keystore")
            storePassword = "caderneta"
            keyAlias = "caderneta"
            keyPassword = "caderneta"
        }
    }
    buildTypes {
        debug {
            signingConfig = signingConfigs.getByName("caderneta")
        }
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("caderneta")
        }
    }
    sourceSets {
        getByName("main") {
            assets.srcDirs(rootProject.file("docs"))
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.webkit:webkit:1.12.1")
}
